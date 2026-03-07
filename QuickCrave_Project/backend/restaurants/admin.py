from django.contrib import admin
from .models import Restaurant, Category, SubCategory, MenuItem


@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'owner',          # ✅ ADDED
        'cuisine',
        'rating',
        'delivery_time',
        'status',
    )

    search_fields = (
        'name',
        'cuisine',
        'owner__email',   # ✅ search by owner email
    )

    list_filter = (
        'cuisine',
        'status',
    )

    fieldsets = (
        ('Owner Info', {
            'fields': ('owner',),   # ⭐ MOST IMPORTANT FIX
        }),
        ('Basic Info', {
            'fields': (
                'name',
                'cuisine',
                'rating',
                'delivery_time',
                'status',
                'image_url',
                'cover_image_url',
            )
        }),
        ('Contact Info', {
            'fields': (
                'phone',
                'email',
                'website',
                'address',
                'city',
                'state',
                'pincode',
            )
        }),
        ('Legal Info', {
            'fields': (
                'gst_number',
                'fssai_number',
                'pan_number',
            ),
            'classes': ('collapse',),
        }),
        ('Bank Details', {
            'fields': (
                'bank_account_name',
                'bank_account_number',
                'bank_ifsc',
                'bank_name',
            ),
            'classes': ('collapse',),
        }),
        ('Social Links', {
            'fields': (
                'instagram',
                'facebook',
            ),
            'classes': ('collapse',),
        }),
        ('Description', {
            'fields': ('description',),
        }),
    )


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'restaurant')
    list_filter = ('restaurant',)
    search_fields = ('name', 'restaurant__name')


@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category')
    list_filter = ('category',)
    search_fields = ('name', 'category__name')


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'restaurant',
        'category',
        'subcategory',
        'price',
        'item_type',
        'is_available',
    )

    list_filter = (
        'restaurant',
        'item_type',
        'category',
        'subcategory',
        'is_available',
    )

    search_fields = (
        'name',
        'restaurant__name',
        'category__name',
        'subcategory__name',
    )

    fieldsets = (
        ('Basic Info', {
            'fields': (
                'restaurant',
                'category',
                'subcategory',
                'name',
                'price',
                'original_price',
                'item_type',
                'is_available',
                'item_image_url',
            )
        }),
        ('Extra Details', {
            'fields': (
                'prep_time',
                'spice_level',
            ),
            'classes': ('collapse',),
        }),
        ('Description', {
            'fields': ('description',),
        }),
    )
