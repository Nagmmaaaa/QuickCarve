from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Restaurant

User = get_user_model()


class RestaurantRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100, required=False, allow_blank=True)
    phone = serializers.CharField(max_length=20)
    restaurant_name = serializers.CharField(max_length=255)
    cuisine = serializers.CharField(max_length=255, required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(max_length=100, required=False, allow_blank=True)
    state = serializers.CharField(max_length=100, required=False, allow_blank=True)
    pincode = serializers.CharField(max_length=10, required=False, allow_blank=True)
    
    def validate_email(self, value):
        if User.objects.filter(email=value.lower()).exists():
            raise serializers.ValidationError("Email already registered")
        if User.objects.filter(username=value.lower()).exists():
            raise serializers.ValidationError("Email already registered")
        return value.lower()
    
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match"})
        return data
    
    def create(self, validated_data):
        # Use email as username for restaurant owners
        username = validated_data['email'].lower()
        
        user = User.objects.create_user(
            username=username,
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data.get('last_name', ''),
        )
        
        restaurant = Restaurant.objects.create(
            owner=user,
            name=validated_data['restaurant_name'],
            cuisine=validated_data.get('cuisine', ''),
            phone=validated_data['phone'],
            email=validated_data['email'],
            address=validated_data.get('address', ''),
            city=validated_data.get('city', ''),
            state=validated_data.get('state', ''),
            pincode=validated_data.get('pincode', ''),
            status='closed',
        )
        
        return {'user': user, 'restaurant': restaurant}


class RestaurantLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        username = data.get('username', '').lower()
        password = data.get('password', '')
        
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError({"username": "No account found with this username"})
        
        if not user.check_password(password):
            raise serializers.ValidationError({"password": "Incorrect password"})
        
        # Get the restaurant associated with this user
        restaurant = user.restaurants.first()
        if not restaurant:
            raise serializers.ValidationError({"username": "No restaurant linked to this account"})
        
        if not user.is_active:
            raise serializers.ValidationError({"username": "Account is deactivated"})
        
        data['user'] = user
        data['restaurant'] = restaurant
        return data


class RestaurantProfileSerializer(serializers.ModelSerializer):
    owner_name = serializers.SerializerMethodField()
    owner_email = serializers.SerializerMethodField()
    
    class Meta:
        model = Restaurant
        fields = [
            'id', 'name', 'description', 'cuisine', 'phone', 'email',
            'address', 'city', 'state', 'pincode', 'status', 'rating',
            'image_url', 'cover_image_url', 'owner_name', 'owner_email',
            'created_at'
        ]
    
    def get_owner_name(self, obj):
        if obj.owner:
            return f"{obj.owner.first_name} {obj.owner.last_name}".strip()
        return ""
    
    def get_owner_email(self, obj):
        if obj.owner:
            return obj.owner.email
        return ""