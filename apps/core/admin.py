from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from apps.core.models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ("username", "email", "role", "display_name", "whop_email", "date_joined")
    list_filter = ("role", "is_superuser")
    fieldsets = UserAdmin.fieldsets + (
        ("Custom Fields", {"fields": ("role", "display_name", "whop_email")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Custom Fields", {"fields": ("role", "display_name", "whop_email")}),
    )
