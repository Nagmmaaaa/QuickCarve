from rest_framework import serializers
from .models import Order, OrderItem
from restaurants.models import MenuItem, Restaurant


class OrderItemWriteSerializer(serializers.Serializer):
    menu_item = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)

    def validate_menu_item(self, value):
        try:
            MenuItem.objects.get(id=value)
        except MenuItem.DoesNotExist:
            raise serializers.ValidationError(f"MenuItem {value} does not exist.")
        return value


class OrderItemReadSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='menu_item.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item', 'name', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemReadSerializer(many=True, read_only=True)
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)
    restaurant_id = serializers.IntegerField(source='restaurant.id', read_only=True)
    customer_name = serializers.SerializerMethodField()
    customer_phone = serializers.SerializerMethodField()
    customer_email = serializers.EmailField(source='customer.email', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 
            'customer_name', 
            'customer_phone', 
            'customer_email', 
            'restaurant_id',
            'restaurant_name', 
            'total_amount', 
            'status', 
            'created_at', 
            'items'
        ]

    def get_customer_name(self, obj):
        if obj.customer.first_name:
            return f"{obj.customer.first_name} {obj.customer.last_name}".strip()
        return obj.customer.username

    def get_customer_phone(self, obj):
        if hasattr(obj.customer, 'profile'):
            return getattr(obj.customer.profile, 'phone', '')
        return ''


class OrderCreateSerializer(serializers.Serializer):
    restaurant_id = serializers.IntegerField()
    items = OrderItemWriteSerializer(many=True)

    def validate_restaurant_id(self, value):
        try:
            Restaurant.objects.get(id=value)
        except Restaurant.DoesNotExist:
            raise serializers.ValidationError(f"Restaurant {value} does not exist.")
        return value

    def validate(self, attrs):
        items = attrs.get('items', [])
        if not items:
            raise serializers.ValidationError({"items": "Order must contain at least one item."})
        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        restaurant_id = validated_data['restaurant_id']
        items_data = validated_data['items']

        order = Order.objects.create(customer=user, restaurant_id=restaurant_id)
        total_amount = 0

        for item_data in items_data:
            menu_item = MenuItem.objects.get(id=item_data['menu_item'])
            quantity = item_data['quantity']
            unit_price = float(menu_item.price)
            OrderItem.objects.create(
                order=order, 
                menu_item=menu_item, 
                quantity=quantity, 
                price=unit_price
            )
            total_amount += unit_price * quantity

        order.total_amount = total_amount
        order.save()
        return order