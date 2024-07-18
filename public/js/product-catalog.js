document.addEventListener('DOMContentLoaded', function() {
    const decrementButton = document.getElementById('decrement');
    const incrementButton = document.getElementById('increment');
    const quantityDisplay = document.getElementById('quantity');
    const searchInput = document.getElementById('searchInput');
    
    let quantity = 1;

    if (decrementButton) {
        decrementButton.addEventListener('click', function() {
            if (quantity > 1) {
                quantity--;
                quantityDisplay.textContent = quantity;
            }
        });
    }

    if (incrementButton) {
        incrementButton.addEventListener('click', function() {
            quantity++;
            quantityDisplay.textContent = quantity;
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = searchInput.value.trim().toLowerCase();
            const products = document.querySelectorAll('.product');
        
            products.forEach(product => {
                const productNameElement = product.querySelector('h3');
                const productName = productNameElement.textContent.toLowerCase();
                const productDescription = product.querySelector('p').textContent.toLowerCase();
                const isVisible = productName.includes(searchTerm) || productDescription.includes(searchTerm);
                
                if (isVisible) {
                    product.style.display = 'block';
                    // Highlight matching text in product name
                    highlightText(productNameElement, searchTerm);
                } else {
                    product.style.display = 'none';
                }
            });
        });
    }

    // Check product availability and add "unavailable" class if needed
    const allProducts = document.querySelectorAll('.product');
    allProducts.forEach(product => {
        const availabilityElement = product.querySelector('#product-availability');
        if (availabilityElement && parseInt(availabilityElement.textContent) === 0) {
            product.classList.add('unavailable');
        }
    });

    // Handle unavailable products styling
    const unavailableProducts = document.querySelectorAll('.product.unavailable');
    
    unavailableProducts.forEach(product => {
        const addToCartBtn = product.querySelector('.add-to-cart-btn');
        const productImage = product.querySelector('img');
        
        if (addToCartBtn) {
            addToCartBtn.disabled = true;
            addToCartBtn.style.opacity = '0.2';
            productImage.style.opacity = '0.2';
            productImage.style.borderRadius = '8px';
    
            // Change the background color of the product to indicate unavailability
            product.style.backgroundColor = '#d3d3d3';
    
            // Add a semi-transparent overlay to the product image
            const imageOverlay = document.createElement('div');
            imageOverlay.style.position = 'absolute';
            imageOverlay.style.top = '0';
            imageOverlay.style.left = '0';
            imageOverlay.style.width = '100%';
            imageOverlay.style.height = '100%';
            imageOverlay.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
            imageOverlay.style.zIndex = '1';
            imageOverlay.style.borderRadius = '8px';
    
            // Ensure the product image is positioned correctly
            productImage.style.position = 'relative';
            productImage.style.zIndex = '2';
    
            // Create a container for the image and overlay
            const imageContainer = document.createElement('div');
            imageContainer.style.position = 'relative';
            imageContainer.style.width = '100%';
            imageContainer.style.height = 'auto';
            
            // Append the image and overlay to the container
            productImage.parentNode.insertBefore(imageContainer, productImage);
            imageContainer.appendChild(productImage);
            imageContainer.appendChild(imageOverlay);
    
            // Add the "Unavailable" text
            const unavailableText = document.createElement('div');
            unavailableText.style.position = 'absolute';
            unavailableText.style.top = '10px';
            unavailableText.style.left = '10px';
            unavailableText.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
            unavailableText.style.color = 'white';
            unavailableText.style.padding = '5px 10px';
            unavailableText.style.borderRadius = '5px';
            unavailableText.style.zIndex = '3';
            unavailableText.style.fontWeight = 'bold';
            unavailableText.innerText = 'Unavailable';
    
            product.style.position = 'relative';
            product.appendChild(unavailableText);
    
            const productDetails = product.querySelector('.product-details');
            if (productDetails) {
                productDetails.style.filter = 'grayscale(100%)';
            }
        }
    });
});

function highlightText(element, searchTerm) {
    const regex = new RegExp(searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi'); // Escape special characters in searchTerm
    const innerHTML = element.textContent.replace(regex, match => `<mark>${match}</mark>`);
    element.innerHTML = innerHTML;
}

const closeEditPopupBtn = document.getElementById('closeEditPopup');
if (closeEditPopupBtn) {
    closeEditPopupBtn.addEventListener('click', function() {
        hideOverlay();
        document.getElementById('editProductPopup').style.display = 'none';
    });
}

const productEditBtn = document.getElementById('productEdit');
if (productEditBtn) {
    productEditBtn.addEventListener('click', function() {
        showOverlay();
        document.getElementById('editProductPopup').style.display = 'block';
    });
}

const closeAddPopupBtn = document.getElementById('closeAddPopup');
if (closeAddPopupBtn) {
    closeAddPopupBtn.addEventListener('click', function() {
        hideOverlay();
        document.getElementById('addProductPopup').style.display = 'none';
    });
}

const addProductBtn = document.getElementById('addProduct');
if (addProductBtn) {
    addProductBtn.addEventListener('click', function() {
        showOverlay();
        document.getElementById('addProductPopup').style.display = 'block';
    });
}

const editSubmitBtn = document.getElementById('editSubmit');
if (editSubmitBtn) {
    editSubmitBtn.addEventListener('click', function() {
        hideOverlay();
        document.getElementById('editProductPopup').style.display = 'none';
    });
}

const addSubmitBtn = document.getElementById('addSubmit');
if (addSubmitBtn) {
    addSubmitBtn.addEventListener('click', function() {
        hideOverlay();
        document.getElementById('addProductPopup').style.display = 'none';
    });
}

function showOverlay() {
    document.getElementById("overlay").style.display = "block";
}
  
function hideOverlay() {
    document.getElementById("overlay").style.display = "none";
}