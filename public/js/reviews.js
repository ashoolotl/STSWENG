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
    document.getElementById('edit-review').addEventListener('click', function() {
        console.error('edit button clicked');
        const reviewTextDiv = document.getElementById('review-text');
        const ratingMessage = reviewTextDiv.textContent.trim();

        const originalContent = reviewTextDiv.cloneNode(true);

        const label = document.createElement('label');
        label.setAttribute('for', 'reviewEditText');
        const input = document.createElement('input');
        input.type = 'text';
        input.name = 'reviewEditText';
        input.value = ratingMessage;
        input.id = 'reviewEditText';
        input.maxLength = '250';

        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.textContent = 'Cancel';
        cancelButton.id = 'cancelEditReview';

        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Submit';
        submitButton.id = 'submitEditReview';

        reviewTextDiv.replaceWith(label, input, submitButton, cancelButton);

        cancelButton.addEventListener('click', function() {
            const container = label.parentNode;
            container.replaceWith(originalContent);
        });
    });

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

    document.querySelectorAll(".edit-review").forEach((editButton) => {
        editButton.addEventListener("click", function() {
            console.error('edit button clicked');
            const reviewContainer = this.closest('.review-details'); 
            const reviewTextDiv = reviewContainer.querySelector('.review-text');
            const ratingMessage = reviewTextDiv.textContent;
    
            const label = document.createElement('label');
            label.setAttribute('for', 'reviewText');
            const input = document.createElement('input');
            input.type = 'text';
            input.name = 'reviewText';
            input.value = ratingMessage;
            input.id = 'reviewText';
            input.maxLength = '250';
    
            const submitButton = document.createElement('button');
            submitButton.type = 'submit';
            submitButton.textContent = 'Submit';
            submitButton.id = 'submitEditReview';
    
            reviewTextDiv.replaceWith(label, input, submitButton);
        });
    });
});



