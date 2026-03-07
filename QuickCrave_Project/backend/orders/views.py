# orders/views.py - REPLACE ENTIRE FILE

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderCreateSerializer
from restaurants.models import Restaurant


class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        
        # Check if user is restaurant owner
        restaurant = Restaurant.objects.filter(owner=user).first()
        
        if restaurant:
            # Restaurant owner sees their restaurant's orders
            return Order.objects.filter(restaurant=restaurant).order_by('-created_at')
        else:
            # Regular customer sees their own orders
            return Order.objects.filter(customer=user).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        serializer = OrderCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            order = serializer.save()
            read_serializer = OrderSerializer(order)
            return Response(read_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update order status"""
        try:
            order = self.get_object()
            new_status = request.data.get('status')
            
            if new_status in dict(Order.STATUS_CHOICES):
                order.status = new_status
                order.save()
                return Response({'detail': 'Status updated', 'status': order.status})
            else:
                return Response({'error': 'Invalid status'}, status=400)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=404)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def restaurant_orders(request):
    """Get all orders for restaurant owner's panel"""
    restaurant = Restaurant.objects.filter(owner=request.user).first()
    
    if not restaurant:
        # For demo/admin
        restaurant = Restaurant.objects.first()
    
    if not restaurant:
        return Response([])

    orders = Order.objects.filter(restaurant=restaurant).order_by('-created_at')
    
    # Filter by status
    status_filter = request.query_params.get('status')
    if status_filter and status_filter != 'All':
        orders = orders.filter(status=status_filter)
    
    # Search
    search = request.query_params.get('search')
    if search:
        orders = orders.filter(
            Q(id__icontains=search) |
            Q(customer__username__icontains=search)
        )

    # Format response
    orders_data = []
    for order in orders:
        items = order.items.all()
        orders_data.append({
            'id': order.id,
            'customer': {
                'name': order.customer.username,
                'phone': getattr(order.customer, 'profile', None) and order.customer.profile.phone or '',
                'address': getattr(order.customer, 'profile', None) and order.customer.profile.address or '',
            },
            'customer_name': order.customer.username,
            'items': [
                {
                    'name': item.menu_item.name,
                    'qty': item.quantity,
                    'quantity': item.quantity,
                    'price': float(item.price)
                }
                for item in items
            ],
            'status': order.status,
            'total_amount': float(order.total_amount),
            'total_price': float(order.total_amount),
            'created_at': order.created_at.strftime('%Y-%m-%d %H:%M'),
            'order_time': order.created_at.strftime('%I:%M %p'),
            'payment_method': 'Online',  # Add this field to Order model if needed
            'payment_status': 'Paid',     # Add this field to Order model if needed
        })

    return Response(orders_data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_order_status(request, pk):
    """Update order status"""
    try:
        order = Order.objects.get(pk=pk)
        new_status = request.data.get('status')
        
        valid_statuses = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled']
        
        if new_status in valid_statuses:
            order.status = new_status
            order.save()
            return Response({'detail': 'Status updated', 'status': order.status})
        else:
            return Response({'error': 'Invalid status'}, status=400)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=404)