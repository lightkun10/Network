document.addEventListener('DOMContentLoaded', function() {

    // console.log("YOOOOOO");

    // let user = {{user|safe}};
    // let data = JSON.parse("{{ user|escapejs }}");
    // console.log(data);

    view_profile();
});


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

function view_profile() {
    fetch("/username")
    .then(response => response.json())
    .then(profile => {
        console.log(profile);
        // let username = profile["username"];
        // let followersCount = profile["followers"];
        // let followingsCount = profile["followings"];
        // let posts = profile["posts"];
    });
    
    return false;
}