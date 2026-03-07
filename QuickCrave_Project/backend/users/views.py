from django.contrib.auth.models import User, Group
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status, viewsets
from .serializers import UserSerializer, ProfileSerializer, GroupSerializer
from .models import Profile
from restaurants.models import Restaurant


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email', '')
    password = request.data.get('password')
    phone = request.data.get('phone', '')
    address = request.data.get('address', '')
    dob = request.data.get('dob', None)
    gender = request.data.get('gender', '')
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')

    if not username or not password:
        return Response({'error': 'Username and password required'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=400)

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name
    )

    Profile.objects.create(
        user=user,
        phone=phone,
        address=address,
        dob=dob if dob else None,
        gender=gender
    )

    return Response({
        'message': 'User registered successfully',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    }, status=201)


@api_view(['POST'])
@permission_classes([AllowAny])
def restaurant_register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    restaurant_name = request.data.get('restaurant_name')

    if not username or not password or not restaurant_name:
        return Response({'error': 'Invalid data'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=400)

    user = User.objects.create_user(
        username=username,
        password=password
    )

    restaurant = Restaurant.objects.create(
        owner=user,
        name=restaurant_name,
        status='closed'
    )

    return Response({
        'message': 'Restaurant registered successfully',
        'restaurant': {
            'id': restaurant.id,
            'name': restaurant.name
        }
    }, status=201)


@api_view(['POST'])
@permission_classes([AllowAny])
def restaurant_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Invalid credentials'}, status=401)

    try:
        restaurant = Restaurant.objects.get(owner=user)
    except Restaurant.DoesNotExist:
        return Response({'error': 'Not a restaurant account'}, status=403)

    return Response({
        'message': 'Restaurant login successful',
        'restaurant': {
            'id': restaurant.id,
            'name': restaurant.name
        }
    }, status=200)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    profile, _ = Profile.objects.get_or_create(user=user)

    if request.method == 'GET':
        dob_str = ''
        if profile.dob:
            try:
                dob_str = profile.dob.strftime('%Y-%m-%d') if hasattr(profile.dob, 'strftime') else str(profile.dob)
            except:
                dob_str = ''
        
        return Response({
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name or '',
            'last_name': user.last_name or '',
            'email': user.email or '',
            'phone': profile.phone or '',
            'address': profile.address or '',
            'dob': dob_str,
            'gender': profile.gender or '',
        })

    if request.method == 'PUT':
        user.first_name = request.data.get('first_name', user.first_name) or ''
        user.last_name = request.data.get('last_name', user.last_name) or ''
        new_username = request.data.get('username', user.username)
        
        if new_username and new_username != user.username:
            if User.objects.filter(username=new_username).exclude(id=user.id).exists():
                return Response({'error': 'Username already exists'}, status=400)
            user.username = new_username
        
        user.save()

        profile.phone = request.data.get('phone', profile.phone) or ''
        profile.address = request.data.get('address', profile.address) or ''
        profile.gender = request.data.get('gender', profile.gender) or ''
        
        dob_value = request.data.get('dob', None)
        if dob_value and dob_value != '':
            profile.dob = dob_value
        elif dob_value == '':
            profile.dob = None
            
        profile.save()

        return Response({
            'message': 'Profile updated successfully',
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'phone': profile.phone,
            'address': profile.address,
            'dob': str(profile.dob) if profile.dob else '',
            'gender': profile.gender,
        })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user_detail(request):
    user = request.user
    profile, _ = Profile.objects.get_or_create(user=user)
    
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name or '',
        'last_name': user.last_name or '',
        'is_staff': user.is_staff,
        'phone': profile.phone or '',
        'address': profile.address or '',
    })