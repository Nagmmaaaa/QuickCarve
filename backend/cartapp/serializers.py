from rest_framework import serializers
from .models import Cart
from django.contrib.auth.models import User

class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class CartCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/writing cart items"""
    class Meta:
        model = Cart
        fields = ['menu_item', 'restaurant', 'quantity']

class CartSerializer(serializers.ModelSerializer):
    """Serializer for reading/retrieving cart items"""
    user = UserBasicSerializer(read_only=True)
    menu_item_id = serializers.SerializerMethodField()
    item_name = serializers.SerializerMethodField()
    item_price = serializers.SerializerMethodField()
    restaurant_id = serializers.IntegerField(source='restaurant.id', read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = [
            'id',
            'user',
            'menu_item_id',
            'restaurant_id',
            'item_name',
            'item_price',
            'quantity',
            'total',
            'created_at',   
        ]

    def get_menu_item_id(self, obj):
        return obj.menu_item.id if obj.menu_item else None
    
    def get_item_name(self, obj):
        return obj.menu_item.name if obj.menu_item else "Unknown Item"
    
    def get_item_price(self, obj):
        return float(obj.menu_item.price) if obj.menu_item else 0.0

    def get_total(self, obj):
        if obj.menu_item:
            return float(obj.menu_item.price) * obj.quantity
        return 0.0
