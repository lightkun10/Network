document.addEventListener('DOMContentLoaded', function() {

    document.querySelector('#post-text').value = "";    // empty form after/before submitting

    // Load all posts by default
    load_posts();

    /** For JS on index page/all post page */
    document.querySelector('#create-form').onsubmit = function() {

        fetch('/post', {
            method: 'POST',
            body: JSON.stringify({
                text: document.querySelector('#post-text').value
            })
        })
        .then(response => response.json())
        .then(result => {
            // Print result on browser's console
            console.log(result);
            location.reload();
        });

        // return false;
    }
})

/** Function to load all posts on screen */
function load_posts() {

    fetch(`/posts`)
    .then(response => response.json())
    .then(posts => {
        //console.log(posts);

        // for every posts
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
            //FIXME might be an url instead of an h4
            postUser.className = 'post-user';
            let a = document.createElement('a');
            a.appendChild(document.createTextNode(`${username}`));
            // postUser.innerHTML = `<h4>${username}</h4>`
            // postUser.innerHTML = `<a href="{% url 'profile' ${username} %}">${username}</a>`
            a.href = `/${username}`;
            postUser.appendChild(a);
            p.append(postUser);
            // postUser.addEventListener('click', function() {
            //     console.log("Change profile here...");
            //     view_profile(username);
            // })

            let editButton = document.createElement('button');
            editButton.className = 'post-editBtn btn btn-info btn-sm';
            editButton.innerHTML = 'Edit';
            p.append(editButton);
            editButton.addEventListener('click', function() {
                console.log("Edit post content, but for now I just print the log here...");
            })
            
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
            likeLogo.src = 'static/images/unlike.png';
            likeLogo.setAttribute("height", "18.75");
            likeLogo.setAttribute("width", "18.75");
            const likesCounts = document.createElement("span");
            likesCounts.className = 'post-likes-counts'
            likesCounts.textContent = ` ${likes}`;
            postLikes.appendChild(likeLogo);
            postLikes.appendChild(likesCounts)
            p.append(postLikes);
            postLikes.addEventListener('click', function() {
                console.log("Increment like counts and change the logo");
            })

            // Append username to the all post section
            document.querySelector('.all-post-section').append(p);
        });
    });

}

// function view_profile(username) {
//     fetch(`/${username}`)
//     .then(response => response.json())
//     .then(profile => {
//         console.log(profile);
//         // let username = profile["username"];
//         // let followersCount = profile["followers"];
//         // let followingsCount = profile["followings"];
//         // let posts = profile["posts"];
//     });
    
//     return false;
// }