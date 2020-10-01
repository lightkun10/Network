from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # following, followers, posts, likes?
    pass



"""
You will also need to add additional models 
to this file to represent details about posts, 
likes, and followers.
"""