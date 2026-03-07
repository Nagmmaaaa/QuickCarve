import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'qc_backend.settings')
django.setup()

from django.contrib.auth.models import User
from restaurants.models import Restaurant

# Check testrestaurant user
try:
    user = User.objects.get(username='testrestaurant')
    print(f"✓ User found: {user.username}")
    print(f"  - Email: {user.email}")
    print(f"  - First Name: {user.first_name}")
    print(f"  - Last Name: {user.last_name}")
    
    # Check restaurants
    restaurants = user.restaurants.all()
    print(f"  - Restaurants count: {restaurants.count()}")
    
    if restaurants.exists():
        for r in restaurants:
            print(f"    - {r.name}")
    else:
        print("    - NO RESTAURANTS FOUND!")
        
        # Try to create one
        print("\n  Attempting to create restaurant...")
        restaurant = Restaurant.objects.create(
            owner=user,
            name='Test Restaurant',
            cuisine='Multi-Cuisine',
            phone='9999999999',
            email=user.email,
            city='Test City',
            state='Test State',
            status='open'
        )
        print(f"  ✓ Created: {restaurant.name}")
        
except User.DoesNotExist:
    print("✗ User not found!")

# Now test the login
print("\n" + "="*50)
print("Testing Login API")
print("="*50)

from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

user = authenticate(username='testrestaurant', password='testpass123')
if user:
    print(f"✓ User authenticated: {user.username}")
    
    # Check restaurant
    restaurants = user.restaurants.all()
    if restaurants.exists():
        print(f"✓ Restaurant found: {restaurants.first().name}")
    else:
        print("✗ No restaurant linked to user")
else:
    print("✗ Authentication failed")
