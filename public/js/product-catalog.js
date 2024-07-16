// backend API
const addItemToCart = async (data) => {
    try {
      console.log(data);
      const response = await fetch(`/api/v1/carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const resData = await response.json();
      if (resData.status == "success") {
        document.getElementById("successPopup").style.display = "block";
        document.getElementById("successText").innerText = "Item added to cart.";
        document.getElementById("bookingPopup").style.display = "none";
        setTimeout(() => {
          document.getElementById("successPopup").style.display = "none";
          document.getElementById("successText").innerText = "";
        }, 1000);
      }
    } catch (err) {
      console.log(err.message);
      document.getElementById("errorPopup").style.display = "block";
      document.getElementById("errorText").innerText = "An error occurred while adding to cart. Please try again later.";
    }
};

const editProduct = async (data, id) => {
    try {
      console.log(data);
      const response = await fetch(`/api/v1/products/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const resData = await response.json();
      if (resData.status == "success") {
        hideOverlay();
        document.getElementById("successPopup").style.display = "block";
        document.getElementById("successText").innerText = "Product updated.";
        document.getElementById("editProductPopup").style.display = "none";
        setTimeout(() => {
          document.getElementById("successPopup").style.display = "none";
          document.getElementById("successText").innerText = "";
        }, 1000);
      }
    } catch (err) {
      console.log(err.message);
      document.getElementById("errorPopup").style.display = "block";
      document.getElementById("errorText").innerText = "An error occurred while updating product. Please try again later.";
    }
};

// Function to get product details by ID from a server
async function getProductDetails(productId) {
    try {
        const response = await fetch(`/api/v1/products/${productId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const product = await response.json();
        return product;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

// add To Cart Function
document.addEventListener('DOMContentLoaded', async () =>{
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    const products = await getAllProducts();

    if (addToCartBtns) {
        addToCartBtns.forEach((btn) => {
            btn.addEventListener('click', async (e) => {
                const productId = e.target.getAttribute('data-id');
                const product = products.find((product) => product._id === productId);
                const data = {
                    productId: product.name,
                    quantity: document.getElementsByClassName(`quantity-${product.productId}`).textContent,
                    price: product.price,
                };
                await addItemToCart(data);
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // need to change to every product
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

const productEditBtn = document.querySelectorAll('.edit-btn');
productEditBtn.forEach((btn) => {
    btn.addEventListener('click', function() {
        showOverlay();
        document.getElementById('editProductPopup').style.display = 'block';
        const productId = btn.getAttribute('data-edit-product');

        const product = getProductDetails(productId);
        const editProductName = document.getElementById('editProductName');
        const editProductDesc = document.getElementById('editProductDesc');
        const editProductPrice = document.getElementById('editProductPrice');
        const editProductAvailability = document.getElementById('editProductAvailability');

        if (product) {
            editProductName.value = product.name;
            editProductDesc.value = product.description;
            editProductPrice.value = product.price;
            editProductAvailability.value = product.quantity;
        }

        const hiddenInput = document.getElementById('edit-product-id');
        hiddenInput.value = productId;
    });
});

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
        const productId = document.getElementById('editProductId').value;
        const editProductName = document.getElementById('editProductName');
        const editProductDesc = document.getElementById('editProductDesc');
        const editProductPrice = document.getElementById('editProductPrice');
        const editProductAvailability = document.getElementById('editProductAvailability');

        if (editProductName.trim() === '' || editProductDesc.trim() === '' || isNaN(editProductPrice) || isNaN(editProductAvailability)) {
            document.getElementById("error-message").innerText = "One or more fields is empty. Please fill in all fields.";
        } else {
            const data = {
                name: editProductName.value,
                description: editProductDesc.value,
                price: editProductPrice.value,
                quantity: editProductAvailability.value,
            };
            editProduct(data, productId);
        }
    });
}

const addSubmitBtn = document.getElementById('addSubmit');
if (addSubmitBtn) {
    addSubmitBtn.addEventListener('click', function() {
        const addProductName = document.getElementById('addProductName');
        const addProductDesc = document.getElementById('addProductDesc');
        const addProductPrice = document.getElementById('addProductPrice');
        const addProductAvailability = document.getElementById('addProductAvailability');

        if (addProductName.trim() === '' || addProductDesc.trim() === '' || isNaN(addProductPrice) || isNaN(addProductAvailability)) {
            document.getElementById("error-message").innerText = "One or more fields is empty. Please fill in all fields.";
        } else {
            const data = {
                name: addProductName.value,
                description: addProductDesc.value,
                price: addProductPrice.value,
                quantity: addProductAvailability.value,
            };
            addProduct(data);
        }
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

document.getElementById("closePopupError").addEventListener("click", function () {
    document.getElementById("errorPopup").style.display = "none";
});
  