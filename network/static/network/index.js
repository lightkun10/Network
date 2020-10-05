document.addEventListener('DOMContentLoaded', function() {


    /** For JS on index page/all post page */
    document.querySelector('#create-form').onsubmit = function() {
        // Get the text that user type
        let text = document.querySelector('#post-text').value;
        //console.log(`You are typing: ${text}`);

        fetch('/post', {
            method: 'POST',
            body: JSON.stringify({
                text: text
            })
        })
        .then(response => response.json())
        .then(result => {
            // Print result on browser's console
            console.log(result);
        });

        return false;
    }

    
})