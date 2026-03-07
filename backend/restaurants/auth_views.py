from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .auth_serializers import (
    RestaurantRegisterSerializer,
    RestaurantLoginSerializer,
    RestaurantProfileSerializer
)
from .models import Restaurant


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@api_view(['POST'])
@permission_classes([AllowAny])
def restaurant_register(request):
    serializer = RestaurantRegisterSerializer(data=request.data)
    
    if serializer.is_valid():
        result = serializer.save()
        user = result['user']
        restaurant = result['restaurant']
        
        tokens = get_tokens_for_user(user)
        
        return Response({
            'success': True,
            'message': 'Restaurant registered successfully!',
            'tokens': tokens,
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'restaurant': {
                'id': restaurant.id,
                'name': restaurant.name,
                'status': restaurant.status,
            }
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def restaurant_login(request):
    serializer = RestaurantLoginSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data['user']
        restaurant = serializer.validated_data['restaurant']
        
        tokens = get_tokens_for_user(user)
        
        return Response({
            'success': True,
            'message': 'Login successful!',
            'tokens': tokens,
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'restaurant': {
                'id': restaurant.id,
                'name': restaurant.name,
                'status': restaurant.status,
                'image_url': restaurant.image_url,
            }
        })
    
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def restaurant_profile(request):
    try:
        restaurant = Restaurant.objects.get(owner=request.user)
        serializer = RestaurantProfileSerializer(restaurant)
        
        return Response({
            'success': True,
            'restaurant': serializer.data,
            'user': {
                'id': request.user.id,
                'email': request.user.email,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
            }
        })
    except Restaurant.DoesNotExist:
        return Response({
            'success': False,
            'error': 'No restaurant linked to this account'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def restaurant_logout(request):
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        
        return Response({
            'success': True,
            'message': 'Logged out successfully'
        })
    except Exception as e:
        return Response({
            'success': True,
            'message': 'Logged out'
        })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    
    if not old_password or not new_password:
        return Response({
            'success': False,
            'error': 'Both old and new password required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if not user.check_password(old_password):
        return Response({
            'success': False,
            'error': 'Current password is incorrect'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user.set_password(new_password)
    user.save()
    
    tokens = get_tokens_for_user(user)
    
    return Response({
        'success': True,
        'message': 'Password changed successfully',
        'tokens': tokens
    })