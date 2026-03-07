from django.db import models
from django.conf import settings


class Restaurant(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
    ]

    owner = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name="restaurants"
)

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    cuisine = models.CharField(max_length=255, blank=True)

    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    website = models.URLField(max_length=500, blank=True, null=True)

    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    pincode = models.CharField(max_length=10, blank=True, null=True)

    gst_number = models.CharField(max_length=20, blank=True, null=True)
    fssai_number = models.CharField(max_length=20, blank=True, null=True)
    pan_number = models.CharField(max_length=15, blank=True, null=True)

    bank_account_name = models.CharField(max_length=255, blank=True, null=True)
    bank_account_number = models.CharField(max_length=50, blank=True, null=True)
    bank_ifsc = models.CharField(max_length=20, blank=True, null=True)
    bank_name = models.CharField(max_length=255, blank=True, null=True)

    instagram = models.CharField(max_length=100, blank=True, null=True)
    facebook = models.CharField(max_length=100, blank=True, null=True)

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='open')
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    delivery_time = models.CharField(max_length=50, default='30-40 min')

    image_url = models.URLField(max_length=500, blank=True)
    cover_image_url = models.URLField(max_length=500, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class OperatingHours(models.Model):
    DAY_CHOICES = [
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
        ('Sunday', 'Sunday'),
    ]

    restaurant = models.ForeignKey(
        Restaurant,
        related_name='operating_hours',
        on_delete=models.CASCADE
    )
    day = models.CharField(max_length=10, choices=DAY_CHOICES)
    open_time = models.TimeField(null=True, blank=True)
    close_time = models.TimeField(null=True, blank=True)
    is_closed = models.BooleanField(default=False)

    class Meta:
        unique_together = ('restaurant', 'day')
        ordering = ['id']

    def __str__(self):
        return f"{self.restaurant.name} - {self.day}"


class Category(models.Model):
    restaurant = models.ForeignKey(
        Restaurant,
        related_name='categories',
        on_delete=models.CASCADE
    )
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return f"{self.name} ({self.restaurant.name})"


class SubCategory(models.Model):
    category = models.ForeignKey(
        Category,
        related_name='subcategories',
        on_delete=models.CASCADE
    )
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = "Sub Categories"

    def __str__(self):
        return f"{self.name} ({self.category.name})"


class MenuItem(models.Model):
    ITEM_TYPE_CHOICES = [
        ('veg', 'Veg'),
        ('non-veg', 'Non-Veg'),
    ]

    restaurant = models.ForeignKey(
        Restaurant,
        related_name='menu',
        on_delete=models.CASCADE
    )
    category = models.ForeignKey(
        Category,
        related_name='items',
        on_delete=models.CASCADE
    )
    subcategory = models.ForeignKey(
        SubCategory,
        related_name='menu_items',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    item_type = models.CharField(max_length=20, choices=ITEM_TYPE_CHOICES, default='veg')
    item_image = models.ImageField(upload_to='menu_items/', null=True, blank=True)
    item_image_url = models.URLField(max_length=500, blank=True, null=True)

    is_available = models.BooleanField(default=True)
    prep_time = models.CharField(max_length=50, default='15 min')
    spice_level = models.IntegerField(default=1)

    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    order_count = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.restaurant.name}"