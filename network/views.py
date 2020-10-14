import json
from django.contrib.auth import authenticate, login, logout, get_user
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse
from django.views.generic import ListView
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.core.paginator import Paginator

from .models import *

def index(request):
    # Authenticated users
    if request.user.is_authenticated:

        # Display all available posts
        posts = Post.objects.order_by("-created_at").all()

        json_posts = json.dumps([post.serialize() for post in posts])

        paginator = Paginator(posts, 10) # Show 10 contacts per page.
        # paginator = Paginator(posts, 5) # Show 5 contacts per page.
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)

        # Get current user
        cur_user = get_user(request)
        # filter 

        # return JsonResponse([post.serialize() for post in posts], safe=False)
        return render(request, "network/index.html", {
            'posts': json_posts,
            'page_obj': page_obj,
            'current_user': cur_user
        })

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
    print(data)
    post_text = data["text"]
    user = get_user(request)

    # Fetch current user in db, and update the posts
    new_post = Post(user=user, text=post_text)
    new_post.save()
    user.posts.add(new_post)

    return JsonResponse({"message": "Post added successfully."}, status=201)


@csrf_exempt
@login_required
def user_profile(request, username):

    # Query for requested profile
    try:
        user = User.objects.get(username=username)
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
            'user': cur_user,
            'select_user': json_user,
            'is_user': str(is_user).lower(),
            'is_following': str(is_following).lower()
        })
    
    # Toggle follow/unfollow post
    elif request.method == "POST":
        # Get response data after button clicked from js
        data = json.loads(request.body)
        update_follow = data.get("update_follow_status")
                
        # Follow user
        if update_follow == "follow":
            print("You want to follow this account")
            try:
                newf = Follow(user=cur_user, user_follow=user)
                newf.save()
                return JsonResponse({"message": "You follow this account."}, status=201)
            except:
                return JsonResponse({"message": "Failed following the account. Try again."}, status=400)
        # Unfollow user
        elif update_follow == "unfollow":
            try:
                cur_user.followings.get(user_follow=user).delete()
                return JsonResponse({"message": "Successfully unfollow the account."}, status=201)
            except:
                return JsonResponse({"message": "Failed following the account. Try again."}, status=400)
        # return JsonResponse({"message": "Server is listening."}, status=201)

    # Profile must be via GET or PUT
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)


@login_required
# View for current user's following posts
def following_view(request, username):

    # print(username)

    return render(request, "network/following.html", {'username': username})
    # return HttpResponse("OK")


@login_required
def following_get(request, username):

    #print(username)
    # Query for requested profile
    try:
        user = User.objects.get(username=username)
        is_user = get_user(request).username == user.username
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found."}, status=404)

    # Get all followings as 'User' Object in a List
    followings = [following.user_follow for following in user.followings.all()]

    posts = Post.objects.order_by("-created_at").all()

    following_posts = []

    # NOTE: Using linear search. I think it need faster searching algo here...
    for following in followings:
        for post in posts:
            if post.user == following:
                following_posts.append(post)
    
    # print(following_posts)
    return JsonResponse([post.serialize() for post in following_posts], safe=False)


@csrf_exempt
@login_required
# Display a single post or edit them
def single_post(request, username, post_id):

    # If user put a request to edit a post 
    if request.method == "PUT":
        data = json.loads(request.body)
        # print(post_id)
        # print(data["text"])
        cur_post = Post.objects.get(pk=post_id)
        cur_post.text = data["text"]
        cur_post.save()
        updated_post = cur_post.text

        return JsonResponse({"message": "Post edited successfully."}, status=201)

    else:
        user = get_user(request)
        post = Post.objects.get(pk=post_id)
        #print(f"'{post.text}' by {post.user}")
        return render(request, "network/editpost.html", {
            'user': user,
            'post': post
        })


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


class PostList(ListView):
    paginate_by = 5
    model = Post
    template_name = 'network/index.html'
    context_object_name = 'posts'