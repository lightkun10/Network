
document.addEventListener('DOMContentLoaded', function() {

        
    let isUserLoggedIn = JSON.parse(JSON.parse(is_user.text))
    let user = JSON.parse(JSON.parse(select_user.text));
    isFollowing = JSON.parse(JSON.parse(is_following.text));
    isFollowing ? console.log(`You are following this acc`) : console.log("You aren't following this acc");

    // console.log(user['posts']);

    let username = user["username"];
    let id = user["id"];
    let followers = user["followers"];
    let followings = user["followings"];
    let posts = user['posts']; // NOTE: It's an array.

    // console.log(Array.isArray(posts));

    fill_username(username);
    fill_followers(username, followers);
    fill_followings(username, followings);
    fill_posts(id, username, posts);

    if (!isUserLoggedIn) fill_flwbtn(username);

    if (!isUserLoggedIn) {
        const followBtn = document.querySelector('.followBtn');
        followBtn.addEventListener('click', function() {
            // console.log('Button clicked');

            let update = !isFollowing
    
            fetch(`/${username}`, {
                method: 'POST',
                body: JSON.stringify({
                    username: username,
                    update_follow_status: update === false ? "unfollow" : "follow"
                })
            })
            .then(response => response.json())
            .then(result => {
                // console.log(result);
                location.reload(); // refresh the current page
            })
        });
    }

});

function fill_posts(id, username, posts) {
    
    posts.forEach(post => {

        const id = post.id;
        const post_text = post.text;

        let postSection = document.createElement('div');
        postSection.className = 'postItem post-section';
        postSection.setAttribute('data-post', id);

        // NOTE Here might be good If I insert profile info and date created...

        let postContent = document.createElement('div');
        postContent.className = 'post-content';
        postSection.appendChild(postContent);

        let postText = document.createElement('div');
        postText.className = 'post-text';
        postText.innerHTML = `${post_text}`
        postSection.appendChild(postText);

        let postLikes = document.createElement('div');
        postLikes.className = 'post-likes';
        let likeLogo = document.createElement("img");
        likeLogo.className = 'likes-logo';
        const likesCounts = document.createElement("span");
        likesCounts.className = 'likes-count';
        postLikes.appendChild(likeLogo);
        postLikes.appendChild(likesCounts)
        postSection.appendChild(postLikes);

        showLikes(username, id);

        likeLogo.addEventListener('click', function() {
            fetch(`/${username}/post/${id}/addlikes`)
            .then(response => response.json())
            .then(ps => {
                // console.log(ps["post_id"])

                if (ps["add_like"] === 'true') {
                    // console.log("You want to dislike this post");
                    console.log(post);
                    let postDiv = document.querySelector(`[data-post='${ps["post_id"]}']`);
                    // console.log(p)
                    unLike(username, id, postDiv);
                } else {
                    // console.log("You want to like this post");
                    console.log(post);
                    let postDiv = document.querySelector(`[data-post='${ps["post_id"]}']`);
                    // console.log(p)
                    addLike(username, id, postDiv);
                }
            });
        });

        document.querySelector('.posts-section').append(postSection);
    });
}


function fill_username(username) {
    document.querySelector('.username-section').innerHTML = `${username}`;
}


function fill_followers(username, followers) {
    let fn = document.querySelector('.followers-num'); // followers count
    let fs = document.querySelector('.followers-str'); // followers string

    fn.innerHTML = `${followers}`;
    fs.innerHTML = fs > 1 ? `Followers` : `Follower`;
}


function fill_followings(username, followings) {
    let fn = document.querySelector('.followings-num'); // followings count
    let fs = document.querySelector('.followings-str'); // followings string

    fn.innerHTML = `${followings}`;
    fs.innerHTML = fs > 1 ? `Followings` : `Following`;
}

function fill_flwbtn(username) {
    // console.log("you can follow this user");
    // isFollowing ? console.log("But you already follow this user, though...") : "";

    
    fb = document.createElement('button');
    fb.innerHTML = isFollowing ? 'Unfollow' : 'Follow';
    fb.className = isFollowing ? 'followBtn btn btn-primary' : 'followBtn btn btn-outline-primary'

    // fb.innerHTML = 'Follow';
    // fb.className = 'followBtn btn btn-outline-primary';

    document.querySelector('.followBtn-section').append(fb);
}

function showLikes(username, postid) {
    
    fetch(`/${username}/post/${postid}/addlikes`)
    .then(response => response.json())
    .then(ps => {
        
        let p = document.querySelector(`[data-post='${postid}']`)
        let likeImg = p.querySelector('.likes-logo');
        likeImg.setAttribute('width', 20);
        likeImg.setAttribute('heigth', 97);

        showLikesCount(username, postid);

        likeImg.src = ps["add_like"] === 'true' ? "/static/images/like.png" : "/static/images/unlike.png";
    })

}

function showLikesCount(username, postid) {
    fetch(`/${username}/post/${postid}/likes_count`)
    .then(response => response.json())
    .then(ps => {
        let postDiv = document.querySelector(`[data-post='${postid}']`)
        let likeCount = postDiv.querySelector('.likes-count');
        likeCount.innerText = ps["likes"];
    })
}

function addLike(username, id, postDiv) {
    
    // Fetch the db for the post that going to be liked
    fetch(`/${username}/post/${id}/addlikes`, {
        method: 'POST',
        body: JSON.stringify({
            post_author: username,
            post_id: id
        })
    })
    .then(response => response.json())
    .then(result => {
        
        if (result["status"] === 'success') {
            postDiv.querySelector('.likes-logo').src = "/static/images/like.png";
            // showLikesCount(post);
            showLikes(username, id);
        }
    });

}

function unLike(username, id, postDiv) {
    
    // Fetch the db for the post that going to be liked
    fetch(`/${username}/post/${id}/dislikes`, {
        method: 'POST',
        body: JSON.stringify({
            post_author: username,
            post_id: id
        })
    })
    .then(response => response.json())
    .then(result => {
        
        if (result["status"] === 'success') {
            postDiv.querySelector('.likes-logo').src = "/static/images/unlike.png";
            // showLikesCount(post);
            showLikes(username, id);
        }
    });

}