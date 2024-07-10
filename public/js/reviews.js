document.addEventListener('DOMContentLoaded', function() {
    const userRole = document.getElementById('userRole').value;
    function handleStarsInput(stars, rating) {
        document.getElementById('ratingInput').value = rating;
        stars.forEach(s => {
            s.classList.remove('selected');
            if (s.getAttribute('data-rating') <= rating) {
                s.classList.add('selected');
            }
        });
    }
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

        const stars = document.querySelectorAll('.star');
        const ratingInput = document.getElementById('ratingInput');
        // for cancel button
        const originalRating = parseInt(ratingInput.value);

        const wrappedHandler = function(event) {
            const rating = parseInt(this.getAttribute('data-rating'));
            handleStarsInput(stars, rating);
        };

        stars.forEach(star => {
            star.style.cursor = 'pointer';
            star.addEventListener('click', wrappedHandler);
        });

        function applyOriginalRating() {
            handleStarsInput(stars, originalRating);
        }

        const reviewTextDiv = document.getElementById('review-text');
        const ratingMessage = reviewTextDiv.textContent.trim();

        const originalContent = reviewTextDiv.cloneNode(true);

        const label = document.createElement('label');
        label.setAttribute('for', 'reviewEditText');
        const input = document.createElement('input');
        input.style.marginTop = '16px';
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
        const container = document.createElement('div');
        container.appendChild(label);
        container.appendChild(input);
        container.appendChild(submitButton);
        container.appendChild(cancelButton);
        reviewTextDiv.replaceWith(container);

        cancelButton.addEventListener('click', function() {
            container.replaceWith(originalContent);
            applyOriginalRating(); // Restore original rating
            stars.forEach(star => {
                star.style.cursor = 'default';
                star.removeEventListener('click', wrappedHandler);
            });
        });

        submitButton.addEventListener('click', function() {
            const newRatingMessage = document.getElementById('reviewEditText').value.trim();
            const reviewId = document.getElementById('reviewId').value;
            const data = new FormData();
            data.append('rating', ratingInput.value);
            data.append('ratingMessage', newRatingMessage);
            data.append('reviewId', reviewId);
            console.log(ratingInput.value, newRatingMessage, reviewId);

            const newRating = document.createElement('div');
            newRating.innerText = newRatingMessage;
            newRating.id = 'review-text';
            newRating.classList.add('review-text');
            container.replaceWith(newRating);

            const currentDate = new Date();
            const formattedDate = (currentDate.getMonth() + 1) + '/' + currentDate.getDate() + '/' + currentDate.getFullYear();
            document.querySelector('.review-date').innerText = `Edited ${formattedDate}`;

            stars.forEach(star => {
                star.style.cursor = 'default';
                star.removeEventListener('click', wrappedHandler);
            });
            // updateReview(data);
        });
    });

    // reply button FOR ADMIN ONLY
    if (userRole === 'admin') {
        const replyButton = document.querySelector('.reply-button');
        const adminInputForm = document.getElementById('admin-input');

        replyButton.addEventListener('click', function() {
            adminInputForm.style.display = 'flex';
            replyButton.style.display = 'none';
        });
    }
});



