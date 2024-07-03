document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.star-rating .star');
    const ratingInput = document.getElementById('ratingInput');

    stars.forEach(star => {
        star.addEventListener('click', function(event) {
            event.preventDefault();
            const rating = this.getAttribute('data-rating');
            ratingInput.value = rating;
            stars.forEach(s => {
                s.classList.remove('selected');
                if (s.getAttribute('data-rating') <= rating) {
                    s.classList.add('selected');
                }
            });
        });
    });
});

document.getElementById("reviewBtn").addEventListener("click", function () {
    document.getElementById("reviewPopup").style.display = "block";
}); // opening of review popup

document.getElementById("closePopup").addEventListener("click", function () {
    document.getElementById("reviewPopup").style.display = "none";
}); // closing of review popup through x button