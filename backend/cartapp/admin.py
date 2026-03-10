from django.contrib import admin
from .models import Cart

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'restaurant', 'menu_item', 'quantity', 'created_at')
    search_fields = ('menu_item__name', 'user__username', 'restaurant__name')
    list_filter = ('restaurant', 'created_at')
