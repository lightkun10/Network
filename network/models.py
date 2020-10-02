from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # posts, likes?
    pass

class Follow(models.Model):
    user = models.ForeignKey(User, related_name="user", on_delete=models.CASCADE)
    user_follow = models.ForeignKey(User, related_name="user_follow", on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

    # Returns string representation of a particular object
    def __str__(self):
        return f"{self.user} following {self.user_follow} at {self.date}"


"""
You will also need to add additional models 
to this file to represent details about posts, 
likes, and followers.
"""