    

document.addEventListener('DOMContentLoaded', function() {

    // star rating
    // const stars = document.querySelectorAll('.star-rating .star');
    // stars.forEach(star => {
    //     star.addEventListener('click', function() {
    //         const rating = this.getAttribute('data-rating');
    //         stars.forEach(s => {
    //             s.classList.remove('selected');
    //             if (s.getAttribute('data-rating') <= rating) {
    //                 s.classList.add('selected');
    //             }
    //         });
    //     });
    // });

    // reply button FOR ADMIN ONLY
    const replyButton = document.querySelector('.reply-button');
    const adminInputForm = document.getElementById('admin-input');

    replyButton.addEventListener('click', function() {
        adminInputForm.style.display = 'flex';
        replyButton.style.display = 'none';
    });

    // editable text area
    const editReviewLink = document.querySelector('.edit-review-link');
    const reviewText = document.querySelector('.review-text');
    const originalReviewText = reviewText.textContent.trim(); // Store original review text

    editReviewLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link behavior
        const textarea = document.createElement('textarea');
        textarea.className = 'edit-textarea';
        textarea.value = originalReviewText;
        textarea.style.resize = 'none'; // Disable textarea resize

        // Apply styling similar to review-replies input[type="text"]
        textarea.style.padding = '8px';
        textarea.style.border = '2px solid #ED1C24';
        textarea.style.borderRadius = '10px';

        // Replace review text with textarea
        reviewText.replaceWith(textarea);

        // Create and append save button
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.type = 'button';
        saveButton.className = 'reply-button';
        textarea.insertAdjacentElement('afterend', saveButton);

        // Hide edit link and dropdown on edit mode
        editReviewLink.style.display = 'none';
        document.querySelector('.dropdown').style.display = 'none';

        // Add event listener for saving changes
        saveButton.addEventListener('click', function() {
            reviewText.textContent = textarea.value.trim();
            textarea.replaceWith(reviewText);
            editReviewLink.style.display = 'block';
            document.querySelector('.dropdown').style.display = 'block';
            saveButton.style.display = 'none';
        });
    });
});