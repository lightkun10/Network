
document.addEventListener('DOMContentLoaded', function() {
    
    let isUserLoggedIn = JSON.parse(JSON.parse(is_user.text))
    user = JSON.parse(JSON.parse(select_user.text));
    isFollowing = JSON.parse(JSON.parse(is_following.text));
    isFollowing ? console.log(`You are following this acc`) : console.log("You aren't following this acc");

    let username = user["username"];
    let followers = user["followers"];
    let followings = user["followings"];
    let posts = user["posts"]; // NOTE: It's an array.

    fill_username(username);
    fill_followers(username, followers);
    fill_followings(username, followings);
    fill_posts(username, posts);

    if (!isUserLoggedIn) fill_flwbtn(username);

    if (!isUserLoggedIn) {
        const followBtn = document.querySelector('.followBtn');
        followBtn.addEventListener('click', function() {
            console.log('Button clicked');

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
                console.log(result);
                location.reload(); // refresh the current page
            })
        });
    }

});

function fill_posts(username, posts) {
    
    posts.forEach(post => {

        let postSection = document.createElement('div');
        postSection.className = 'post-section';

        // NOTE Here might be good If I insert profile info and date created...

        let postContent = document.createElement('div');
        postContent.className = 'post-content';
        postSection.appendChild(postContent);

        let postText = document.createElement('div');
        postText.className = 'post-text';
        postText.innerHTML = `${post}`
        postSection.appendChild(postText);

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
    console.log("you can follow this user");
    isFollowing ? console.log("But you already follow this user, though...") : "";

    
    fb = document.createElement('button');
    fb.innerHTML = isFollowing ? 'Unfollow' : 'Follow';
    fb.className = isFollowing ? 'followBtn btn btn-primary' : 'followBtn btn btn-outline-primary'

    // fb.innerHTML = 'Follow';
    // fb.className = 'followBtn btn btn-outline-primary';

    document.querySelector('.followBtn-section').append(fb);
}