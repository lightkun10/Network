let user = username.text;
user = user.slice(1, -1);
// console.log(user);

function showLikes(post) {

    const username = post["username"];
    const id = post["id"];
    fetch(`/${username}/post/${id}/addlikes`)
    .then(response => response.json())
    .then(ps => {

        let p = document.querySelector(`[data-post='${post["id"]}']`)
        // Setup attribute for like logo
        let likeImg = p.querySelector('.likes-logo');
        likeImg.setAttribute('width', 20);
        likeImg.setAttribute('heigth', 97);

        showLikesCount(post);

        likeImg.src = ps["add_like"] === 'true' ? "/static/images/like.png" : "/static/images/unlike.png";
    })
}

function showLikesCount(post) {
    const username = post["username"];
    const id = post["id"];
    fetch(`/${username}/post/${id}/likes_count`)
    .then(response => response.json())
    .then(ps => {

        let postDiv = document.querySelector(`[data-post='${id}']`)
        let likeCount = postDiv.querySelector('.likes-count');
        likeCount.innerText = ps["likes"];
    })
}

document.addEventListener('DOMContentLoaded', function() {

    /** Fetch all posts of followed user. */
    fetch(`/${user}/following_get`)
    .then(response => response.json())
    .then(posts => {

        if (posts.length > 0) {
            posts.forEach(post => {
                
                let id = post["id"];
                let username = post["username"];
                let content = post["content"];
                let created_at = post["created_at"];
                let likes = post["likes"];
    
                // Make a new div to display post
                const p = document.createElement('div');
                p.className = `post-${id} postItem`
                p.setAttribute('data-post', id);
    
                const postUser = document.createElement('div');
                postUser.className = 'post-user';
                let a = document.createElement('a');
                a.appendChild(document.createTextNode(`${username}`));
    
                a.href = `/${username}`;
                postUser.appendChild(a);
                p.append(postUser);
                    
                const postContent = document.createElement('div');
                postContent.className = 'post-content';
                postContent.innerHTML = `${content}`
                p.append(postContent);
    
                const postTime = document.createElement('div');
                postTime.className = 'post-time';
                postTime.innerHTML = created_at;
                p.append(postTime);
    
                const postLikes = document.createElement('div');
                postLikes.className = 'post-likes';
                let likeLogo = document.createElement("img");
                likeLogo.className = 'likes-logo';
                const likesCounts = document.createElement("span");
                likesCounts.className = 'likes-count';
                // likesCounts.textContent = ` ${likes}`;
                postLikes.appendChild(likeLogo);
                postLikes.appendChild(likesCounts)
                p.append(postLikes);

                // console.log(post);

                showLikes(post);

                likeLogo.addEventListener('click', function() {

                    fetch(`/${username}/post/${id}/addlikes`)
                    .then(response => response.json())
                    .then(ps => {
                        // console.log(ps["post_id"])

                        if (ps["add_like"] === 'true') {
                            // console.log("You want to dislike this post");
                            console.log(post);
                            let p = document.querySelector(`[data-post='${ps["post_id"]}']`);
                            // console.log(p)
                            unLike(username, id, p, post);
                        } else {
                            // console.log("You want to like this post");
                            console.log(post);
                            let p = document.querySelector(`[data-post='${ps["post_id"]}']`);
                            // console.log(p)
                            addLike(username, id, p, post);
                        }
                    })
                })
    
                // Append username to the all post section
                document.querySelector('.followings-post-section').append(p);
            })

        }
        else {
            // Make a new div to display info about no following
            const p = document.createElement('div');
            p.className = `post no-post`
            p.innerHTML = "You are not following anyone right now.";

            // Append username to the all post section
            document.querySelector('.followings-post-section').append(p);
        }
        
    })
});

function addLike(username, id, postDiv, post) {
    
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
            showLikes(post);
        }
    });

}

function unLike(username, id, postDiv, post) {
    
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
            showLikes(post);
        }
    });

}