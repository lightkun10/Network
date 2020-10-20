
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"), # default route
    path("login", views.login_view, name="login"), # login route
    path("logout", views.logout_view, name="logout"), # logout route
    path("register", views.register, name="register"), # register route,
    path("<str:username>/following", views.following_view, name="following"),
    path("<str:username>/post/<int:post_id>", views.single_post, name="post"),

    # API routes
    path("post", views.create, name="create"),
    path("<str:username>", views.user_profile, name="profile"),
    path("<str:username>/following_get", views.following_get, name="following_get"),
    path("<str:username>/post/<int:post_id>/addlikes", views.addlikes, name="addlikes"),
    path("<str:username>/post/<int:post_id>/dislikes", views.dislikes, name="dislikes"),
    path("<str:username>/post/<int:post_id>/likes_count", views.post_likers_count, name="likes_count"),
]
