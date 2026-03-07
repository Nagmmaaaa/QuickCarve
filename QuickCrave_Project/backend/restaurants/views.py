from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Q, Sum, Prefetch
from django.utils import timezone
from datetime import timedelta

from .models import Restaurant, MenuItem, Category, OperatingHours
from .serializers import (
    RestaurantSerializer, MenuItemSerializer, CategorySerializer,
    RestaurantSettingsSerializer
)


def get_owner_restaurant(user):
    try:
        return Restaurant.objects.get(owner=user)
    except Restaurant.DoesNotExist:
        return None


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    pagination_class = None

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        qs = Category.objects.all()
        restaurant_id = self.request.query_params.get('restaurant')
        if restaurant_id and restaurant_id.isdigit():
            qs = qs.filter(restaurant_id=int(restaurant_id))
        return qs


class RestaurantViewSet(viewsets.ModelViewSet):
    serializer_class = RestaurantSerializer
    pagination_class = None

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'menu']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        qs = Restaurant.objects.all().prefetch_related(
            Prefetch('menu', queryset=MenuItem.objects.filter(is_available=True))
        )

        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(
                Q(name__icontains=search) |
                Q(cuisine__icontains=search)
            ).distinct()

        ordering = self.request.query_params.get('ordering')
        if ordering in ('rating', '-rating', 'name', '-name'):
            qs = qs.order_by(ordering)

        return qs

    @action(detail=True, methods=['get'])
    def menu(self, request, pk=None):
        restaurant = self.get_object()
        items = restaurant.menu.all()

        search = request.query_params.get('search')
        if search:
            items = items.filter(Q(name__icontains=search))

        category = request.query_params.get('category')
        if category:
            items = items.filter(category__name__iexact=category)

        item_type = request.query_params.get('item_type')
        if item_type in ('veg', 'non-veg'):
            items = items.filter(item_type=item_type)

        return Response(MenuItemSerializer(items, many=True, context={'request': request}).data)


class MenuItemViewSet(viewsets.ModelViewSet):
    serializer_class = MenuItemSerializer
    pagination_class = None

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        qs = MenuItem.objects.select_related('restaurant', 'category')

        restaurant_id = self.request.query_params.get('restaurant')
        if restaurant_id and restaurant_id.isdigit():
            qs = qs.filter(restaurant_id=int(restaurant_id))

        if self.request.query_params.get('my_restaurant'):
            restaurant = get_owner_restaurant(self.request.user)
            if not restaurant:
                return MenuItem.objects.none()
            qs = qs.filter(restaurant=restaurant)

        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(Q(name__icontains=search))

        category = self.request.query_params.get('category')
        if category and category != 'All':
            qs = qs.filter(category__name__iexact=category)

        item_type = self.request.query_params.get('item_type')
        if item_type in ('veg', 'non-veg'):
            qs = qs.filter(item_type=item_type)

        return qs.order_by('-created_at')

    def perform_create(self, serializer):
        restaurant = get_owner_restaurant(self.request.user)
        if not restaurant:
            return Response({'error': 'Unauthorized'}, status=403)
        serializer.save(restaurant=restaurant)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def restaurant_dashboard(request):
    restaurant = get_owner_restaurant(request.user)
    if not restaurant:
        return Response({'error': 'No restaurant linked'}, status=403)

    from orders.models import Order

    today = timezone.now().date()
    all_orders = Order.objects.filter(restaurant=restaurant)
    today_orders = all_orders.filter(created_at__date=today)

    total_revenue = all_orders.filter(
        status='Delivered'
    ).aggregate(Sum('total_amount'))['total_amount__sum'] or 0

    today_revenue = today_orders.filter(
        status='Delivered'
    ).aggregate(Sum('total_amount'))['total_amount__sum'] or 0

    total_menu_items = MenuItem.objects.filter(restaurant=restaurant).count()
    available_items = MenuItem.objects.filter(
        restaurant=restaurant,
        is_available=True
    ).count()

    return Response({
        'restaurant': {
            'id': restaurant.id,
            'name': restaurant.name,
            'status': restaurant.status,
        },
        'stats': {
            'total_orders': all_orders.count(),
            'today_orders': today_orders.count(),
            'total_revenue': float(total_revenue),
            'today_revenue': float(today_revenue),
            'total_menu_items': total_menu_items,
            'available_items': available_items,
            'unavailable_items': total_menu_items - available_items,
        }
    })


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def restaurant_settings(request):
    restaurant = get_owner_restaurant(request.user)
    if not restaurant:
        return Response({'error': 'No restaurant linked'}, status=403)

    if request.method == 'GET':
        serializer = RestaurantSettingsSerializer(restaurant)
        data = serializer.data

        hours = OperatingHours.objects.filter(restaurant=restaurant)
        data['operating_hours'] = [
            {
                'day': h.day,
                'open': h.open_time.strftime('%H:%M') if h.open_time else '',
                'close': h.close_time.strftime('%H:%M') if h.close_time else '',
                'isClosed': h.is_closed
            }
            for h in hours
        ]

        data['social_links'] = {
            'instagram': restaurant.instagram or '',
            'facebook': restaurant.facebook or '',
        }

        return Response(data)

    serializer = RestaurantSettingsSerializer(
        restaurant,
        data=request.data,
        partial=True
    )
    if serializer.is_valid():
        serializer.save()
        return Response({'detail': 'Settings updated'})
    return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def restaurant_menu(request):
    restaurant = get_owner_restaurant(request.user)
    if not restaurant:
        return Response([], status=403)

    items = MenuItem.objects.filter(
        restaurant=restaurant
    ).select_related('category')

    serializer = MenuItemSerializer(items, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def restaurant_menu_detail(request, pk):
    try:
        item = MenuItem.objects.get(pk=pk)
    except MenuItem.DoesNotExist:
        return Response({'error': 'Item not found'}, status=404)

    if item.restaurant.owner != request.user:
        return Response({'error': 'Forbidden'}, status=403)

    if request.method == 'GET':
        serializer = MenuItemSerializer(item, context={'request': request})
        return Response(serializer.data)

    serializer = MenuItemSerializer(item, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def restaurant_menu_create(request):
    restaurant = get_owner_restaurant(request.user)
    if not restaurant:
        return Response({'error': 'Unauthorized'}, status=403)

    serializer = MenuItemSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save(restaurant=restaurant)
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def restaurant_menu_delete(request, pk):
    try:
        item = MenuItem.objects.get(pk=pk)
    except MenuItem.DoesNotExist:
        return Response({'error': 'Item not found'}, status=404)

    if item.restaurant.owner != request.user:
        return Response({'error': 'Forbidden'}, status=403)

    item.delete()
    return Response({'detail': 'Item deleted successfully'})