let currentIndex = 0;

function prevSlide() {
    const totalSlides = document.querySelectorAll('.carousel-item').length;
    // If currentIndex is already 0, set it to the index of the last slide
    currentIndex = (currentIndex === 0) ? totalSlides - 1 : currentIndex - 1;
    updateCarousel(totalSlides);
}


function nextSlide() {
    const totalSlides = document.querySelectorAll('.carousel-item').length;
    // Check if the current slide is the last one
    if (currentIndex === totalSlides - 1) {
        // Reset to the first slide
        currentIndex = 0;
    } else {
        // Move to the next slide
        currentIndex++;
    }
    updateCarousel();
}

function updateCarousel() {
    const totalSlides = document.querySelectorAll('.carousel-item').length;
    const carouselInner = document.querySelector('.carousel-inner');
    const offset = -currentIndex * 100;
    carouselInner.style.transform = `translateX(${offset}%)`;
    updateIndicators(totalSlides);
}

// Function to update the active state of indicators
function updateIndicators(totalSlides) {
    const indicators = document.querySelectorAll('.page-number li');
    indicators.forEach((indicator, index) => {
        if (index === currentIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// Add event listeners to next and previous buttons
document.querySelector('.carousel-btn.next').addEventListener('click', nextSlide);
document.querySelector('.carousel-btn.prev').addEventListener('click', prevSlide);

// Initialize indicators
updateCarousel();
