# orders/admin.py
from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    # Safe fields (user may not exist in your model yet or differs)
    list_display = ('id', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    inlines = [OrderItemInline]

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    # Safe fields (remove 'price' if not present in model)
    list_display = ('id', 'order', 'menu_item', 'quantity')
    list_filter = ('order', )