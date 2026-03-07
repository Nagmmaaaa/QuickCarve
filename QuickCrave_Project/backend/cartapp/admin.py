from django.contrib import admin
from .models import Cart

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'restaurant', 'item_name', 'item_price', 'quantity', 'created_at')
    search_fields = ('item_name', 'user__username', 'restaurant__name')
    list_filter = ('restaurant', 'created_at')
