from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

def api_home(request):
    return JsonResponse({"message": "QuickCrave API is running"})

urlpatterns = [
    path('', api_home),
    path('admin/', admin.site.urls),
    path('api/', include('restaurants.urls')),
    path('api/', include('users.urls')),
    path('api/cart/', include('cartapp.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/auth/token/', TokenObtainPairView.as_view()),
    path('api/auth/token/refresh/', TokenRefreshView.as_view()),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)