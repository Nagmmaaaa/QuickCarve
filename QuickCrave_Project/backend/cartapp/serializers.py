from rest_framework import serializers
from .models import Cart
from django.contrib.auth.models import User

class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class CartSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = [
            'id',
            'user',
            'restaurant',
            'item_name',
            'item_price',
            'quantity',
            'total',
            'created_at',   
        ]

    def get_total(self, obj):
        return obj.item_price * obj.quantity
