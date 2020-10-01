
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"), # default route
    path("login", views.login_view, name="login"), # login route
    path("logout", views.logout_view, name="logout"), # logout route
    path("register", views.register, name="register") # register route
]
