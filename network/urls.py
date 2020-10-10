
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"), # default route
    path("login", views.login_view, name="login"), # login route
    path("logout", views.logout_view, name="logout"), # logout route
    path("register", views.register, name="register"), # register route,
    path("<str:username>/following", views.following_view, name="following"),

    # API routes
    path("post", views.create, name="create"),
    path("<str:username>", views.user_profile, name="profile"),
    path("<str:username>/following_get", views.following_get, name="following_get")
]
