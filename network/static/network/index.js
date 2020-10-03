document.addEventListener('DOMContentLoaded', function() {


    /** For JS on index page/all post page */
    document.querySelector('#create-form').onsubmit = function() {
        let text = document.querySelector('#post-text').value;
        console.log(`You are typing: ${text}`);

        return false;
    }
})