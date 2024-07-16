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