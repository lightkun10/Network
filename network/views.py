import json
from django.contrib.auth import authenticate, login, logout, get_user
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from .models import *

def index(request):
    # Authenticated users view their inbox
    if request.user.is_authenticated:
        return render(request, "network/index.html")

    # Unsigned user is prompted to sign in
    else:
        return HttpResponseRedirect(reverse("login"))


@csrf_exempt
@login_required
def create(request):
    # Making a new email must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400);
    
    # Check text of post and user that sent it
    data = json.loads(request.body)
    post_text = data["text"]
    user = get_user(request)

    # Fetch current user in db, and update the posts
    new_post = Post(user=user, text=post_text)
    new_post.save()
    user.posts.add(new_post)

    return JsonResponse({"message": "Post added successfully."}, status=201)


@login_required
def posts(request):

    # Display all available posts
    posts = Post.objects.order_by("-created_at").all()
    return JsonResponse([post.serialize() for post in posts], safe=False)


@csrf_exempt
@login_required
def user_profile(request, username):

    # Query for requested profile
    try:
        user = User.objects.get(username=username)
        #print(get_user(request).username == user.username)
        is_user = get_user(request).username == user.username
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found."}, status=404)

    cur_user = get_user(request)

    try:
        if cur_user.followings.get(user_follow=user):
            is_following = True
    except:
            is_following = False
            pass

    # Return user profile
    if request.method == "GET":

        json_user = json.dumps(user.serialize())

        return render(request, "network/profile.html", {
            'user': json_user,
            'is_user': str(is_user).lower(),
            'is_following': str(is_following).lower()
        })
    
    # Toggle follow/unfollow post
    elif request.method == "POST":
        # Get response data after button clicked from js
        data = json.loads(request.body)
        update_follow = data.get("update_follow_status")
                
        # If user want to follow current account...
        if update_follow == "follow":
            print("You want to follow this account")
            try:
                # Add new followings
                newf = Follow(user=cur_user, user_follow=user)
                newf.save()
                return JsonResponse({"message": "You follow this account."}, status=201)
            except:
                return JsonResponse({"message": "Something's wrong happened..."}, status=400)
        # If user want to unfollow current account...
        elif update_follow == "unfollow":
            print("You want to unfollow this account")
            return JsonResponse({"message": "You want to unfollow this account."}, status=201)
        # return JsonResponse({"message": "Server is listening."}, status=201)

    # Profile must be via GET or PUT
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
