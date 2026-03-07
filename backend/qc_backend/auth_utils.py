from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.exceptions import AuthenticationFailed


class OptionalJWTAuthentication(JWTAuthentication):
    """
    Custom JWT authentication that allows unauthenticated requests
    instead of returning 401. Returns (None, None) for missing/invalid tokens.
    """
    def authenticate(self, request):
        try:
            return super().authenticate(request)
        except AuthenticationFailed:
            # Allow unauthenticated requests - return None to try other auth classes
            return None


class OptionalSessionAuthentication(SessionAuthentication):
    """
    Custom session authentication that allows missing session information
    """
    def authenticate(self, request):
        try:
            return super().authenticate(request)
        except AuthenticationFailed:
            return None


class OptionalBasicAuthentication(BasicAuthentication):
    """
    Custom basic auth that allows missing credentials
    """
    def authenticate(self, request):
        try:
            return super().authenticate(request)
        except AuthenticationFailed:
            return None
