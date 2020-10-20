let user = username.text;
user = user.slice(1, -1);
console.log(user);

document.addEventListener('DOMContentLoaded', function() {

    console.log("OK");

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
                p.className = `post post-${id}`
    
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
    
                // const postLikes = document.createElement('div');
                // postLikes.className = 'post-likes';
                // let likeLogo = document.createElement("img");
                // likeLogo.src = '/static/images/unlike.png';
                // likeLogo.setAttribute("height", "18.75");
                // likeLogo.setAttribute("width", "18.75");
                // const likesCounts = document.createElement("span");
                // likesCounts.className = 'post-likes-counts'
                // likesCounts.textContent = ` ${likes}`;
                // postLikes.appendChild(likeLogo);
                // postLikes.appendChild(likesCounts)
                // p.append(postLikes);
                // postLikes.addEventListener('click', function() {
                //     console.log("Increment like counts and change the logo");
                //     likeLogo.src = '/static/images/like.png';
                // })
    
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