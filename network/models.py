from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # following, followers, posts, likes?
    pass

class Follow(models.Model):
    user = models.ForeignKey(User, related_name="user", on_delete=models.CASCADE)
    user_follow = models.ForeignKey(User, related_name="user_follow", on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

"""
You will also need to add additional models 
to this file to represent details about posts, 
likes, and followers.
"""