from rest_framework import serializers
from .models import Restaurant, Category, SubCategory, MenuItem, OperatingHours


class OperatingHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperatingHours
        fields = ['id', 'day', 'open_time', 'close_time', 'is_closed']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'restaurant']


class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ['id', 'name', 'category']


class MenuItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True, allow_null=True)
    subcategory_name = serializers.CharField(source='subcategory.name', read_only=True, allow_null=True)
    item_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = MenuItem
        fields = [
            'id', 'name', 'description', 'price', 'original_price',
            'category', 'category_name', 'subcategory', 'subcategory_name',
            'item_type', 'item_image', 'item_image_url', 'is_available', 'created_at'
        ]
        read_only_fields = ['created_at', 'item_image_url']


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'
        read_only_fields = ['owner', 'rating', 'created_at', 'updated_at']


class RestaurantSettingsSerializer(serializers.ModelSerializer):
    operating_hours = OperatingHoursSerializer(many=True, read_only=True)
    
    class Meta:
        model = Restaurant
        fields = [
            'id', 'name', 'description', 'cuisine', 'phone', 'email', 'website',
            'address', 'city', 'state', 'pincode',
            'gst_number', 'fssai_number', 'pan_number',
            'bank_account_name', 'bank_account_number', 'bank_ifsc', 'bank_name',
            'instagram', 'facebook', 'status', 'image_url', 'cover_image_url',
            'operating_hours'
        ]


class OperatingHoursUpdateSerializer(serializers.Serializer):
    operating_hours = serializers.ListField(child=serializers.DictField())

    def update_hours(self, restaurant, hours_data):
        for hour_data in hours_data:
            day = hour_data.get('day')
            if day:
                OperatingHours.objects.update_or_create(
                    restaurant=restaurant,
                    day=day,
                    defaults={
                        'open_time': hour_data.get('open_time') or hour_data.get('open'),
                        'close_time': hour_data.get('close_time') or hour_data.get('close'),
                        'is_closed': hour_data.get('is_closed', False)
                    }
                )