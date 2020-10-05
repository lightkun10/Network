document.addEventListener('DOMContentLoaded', function() {


    /** For JS on index page/all post page */
    document.querySelector('#create-form').onsubmit = function() {

        document.querySelector('#post-text').value = "";    // empty form after/before submitting

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