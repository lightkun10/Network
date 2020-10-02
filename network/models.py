from django.contrib.auth.models import AbstractUser
from django.db import models


# posts, likes?

class User(AbstractUser):
    pass

class Post(models.Model):
    user = models.ForeignKey(User, related_name="posts", on_delete=models.CASCADE)
    text = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)


class Follow(models.Model):
    user = models.ForeignKey(User, related_name="followings", on_delete=models.CASCADE)
    user_follow = models.ForeignKey(User, related_name="followers", on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

    # Returns string representation of a particular object
    def __str__(self):
        return f"{self.user} following {self.user_follow} at {self.date}"
    
    # Lists that must be unique when considered together.
    class Meta:
        unique_together = ("user", "user_follow")


"""
You will also need to add additional models 
to this file to represent details about posts, 
likes, and followers.
"""