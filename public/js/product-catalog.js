// backend API
const getAllProducts = async () => {
  try {
    const response = await fetch("/api/v1/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resData = await response.json();
    if (resData.status === "success") {
      return resData.data.products;
    } else {
      throw new Error("Network response was not ok");
    }
  } catch (err) {
    console.log(err.message);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "An error occurred while fetching products. Please try again later.";
  }
};

const addProduct = async (data) => {
  try {
    console.log(data);
    const response = await fetch("/api/v1/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const resData = await response.json();
    if (resData.status == "success") {
      hideOverlay();
      document.getElementById("addProductPopup").style.display = "none";
      document.getElementById("successPopup").style.display = "block";
      document.getElementById("successText").innerText = "Product successfully added.";
      document.getElementById("addProductPopup").style.display = "none";
      document.getElementById("error-message-add").innerText = "";
      setTimeout(() => {
        document.getElementById("successPopup").style.display = "none";
        document.getElementById("successText").innerText = "";
        window.location.reload();
      }, 1000);
    }
  } catch (err) {
    console.log(err.message);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "An error occurred while creating product. Please try again later.";
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
      document.getElementById("successPopup").style.display = "block";
      document.getElementById("successText").innerText = "Product updated.";
      document.getElementById("editProductPopup").style.display = "none";
      document.getElementById("error-message-edit").innerText = "";
    }
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (err) {
    console.log(err.message);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "An error occurred while updating product. Please try again later.";
  }
};

// Function to get product details by ID from a server
async function getProductDetails(productId) {
  try {
    const response = await fetch(`/api/v1/products/${productId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const product = await response.json();
    return product;
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

// add product to cart
const addItemToCart = async (data) => {
  try {
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
      setTimeout(() => {
        document.getElementById("successPopup").style.display = "none";
        document.getElementById("successText").innerText = "";
      }, 1500);
    } else if (resData.status == "error") {
      document.getElementById("errorPopup").style.display = "block";
      document.getElementById("errorText").innerText = "Not enough stock for this product";
    }
  } catch (err) {
    console.log(err.message);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "An error occurred while adding to cart. Please try again later.";
  }
};

// add To Cart Function
document.addEventListener("DOMContentLoaded", async () => {
  const addToCartBtns = document.querySelectorAll(".add-to-cart-btn");
  const products = await getAllProducts();

  if (addToCartBtns) {
    addToCartBtns.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const productId = e.target.getAttribute("data-id");
        const product = products.find((product) => product._id === productId);
        const quantity = document.getElementById(`${productId}-quantity`).textContent;
        const price = quantity * product.price;
        const userId = document.getElementById("userId").value;
        const data = {
          product: product.name,
          description: product.description,
          price: price,
          quantity: quantity,
          owner: userId,
        };
        await addItemToCart(data);
      });
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const quantityDisplays = document.querySelectorAll(".quantity");

  if (quantityDisplays) {
    quantityDisplays.forEach((quantityDisplay) => {
      const prodIdentifier = quantityDisplay.getAttribute("data-prod-id");

      const decrementButton = document.getElementById(`${prodIdentifier}-decrement`);
      const incrementButton = document.getElementById(`${prodIdentifier}-increment`);

      let quantity = parseInt(quantityDisplay.textContent);
      const availability = parseInt(quantityDisplay.getAttribute("data-availability"));

      if (decrementButton) {
        decrementButton.addEventListener("click", function () {
          if (quantity > 1) {
            quantity--;
            quantityDisplay.textContent = quantity;
          }
        });
      }

      if (incrementButton) {
        incrementButton.addEventListener("click", function () {
          if (quantity < availability) {
            quantity++;
            quantityDisplay.textContent = quantity;
          }
        });
      }
    });
  }
  const searchInput = document.getElementById("searchInput");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchTerm = searchInput.value.trim().toLowerCase();
      const products = document.querySelectorAll(".product");

      products.forEach((product) => {
        const productNameElement = product.querySelector("h3");
        const productName = productNameElement.textContent.toLowerCase();
        const productDescription = product.querySelector("p").textContent.toLowerCase();
        const isVisible = productName.includes(searchTerm) || productDescription.includes(searchTerm);

        if (isVisible) {
          product.style.display = "block";
          // Highlight matching text in product name
          highlightText(productNameElement, searchTerm);
        } else {
          product.style.display = "none";
        }
      });
    });
  }

  // Check product availability and add "unavailable" class if needed
  const allProducts = document.querySelectorAll(".product");
  allProducts.forEach((product) => {
    const availabilityElement = product.querySelector(".product-availability");
    if (availabilityElement && parseInt(availabilityElement.textContent) === 0) {
      product.classList.add("unavailable");
    }
  });

  // Handle unavailable products styling
  const unavailableProducts = document.querySelectorAll(".product.unavailable");

  unavailableProducts.forEach((product) => {
    const addToCartBtn = product.querySelector(".add-to-cart-btn");
    const productImage = product.querySelector("img");

    if (addToCartBtn) {
      addToCartBtn.disabled = true;
      addToCartBtn.style.opacity = "0.2";
      productImage.style.opacity = "0.2";
      productImage.style.borderRadius = "8px";

      // Change the background color of the product to indicate unavailability
      product.style.backgroundColor = "#d3d3d3";

      // Add a semi-transparent overlay to the product image
      const imageOverlay = document.createElement("div");
      imageOverlay.style.position = "absolute";
      imageOverlay.style.top = "0";
      imageOverlay.style.left = "0";
      imageOverlay.style.width = "100%";
      imageOverlay.style.height = "100%";
      imageOverlay.style.backgroundColor = "rgba(255, 255, 255, 0.6)";
      imageOverlay.style.zIndex = "1";
      imageOverlay.style.borderRadius = "8px";

      // Ensure the product image is positioned correctly
      productImage.style.position = "relative";
      productImage.style.zIndex = "2";

      // Create a container for the image and overlay
      const imageContainer = document.createElement("div");
      imageContainer.style.position = "relative";
      imageContainer.style.width = "100%";
      imageContainer.style.height = "auto";

      // Append the image and overlay to the container
      productImage.parentNode.insertBefore(imageContainer, productImage);
      imageContainer.appendChild(productImage);
      imageContainer.appendChild(imageOverlay);

      // Add the "Unavailable" text
      const unavailableText = document.createElement("div");
      unavailableText.style.position = "absolute";
      unavailableText.style.top = "10px";
      unavailableText.style.left = "10px";
      unavailableText.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
      unavailableText.style.color = "white";
      unavailableText.style.padding = "5px 10px";
      unavailableText.style.borderRadius = "5px";
      unavailableText.style.zIndex = "3";
      unavailableText.style.fontWeight = "bold";
      unavailableText.innerText = "Unavailable";

      product.style.position = "relative";
      product.appendChild(unavailableText);

      const productDetails = product.querySelector(".product-details");
      if (productDetails) {
        productDetails.style.filter = "grayscale(100%)";
      }
    }
  });
});

function highlightText(element, searchTerm) {
  const regex = new RegExp(searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "gi"); // Escape special characters in searchTerm
  const innerHTML = element.textContent.replace(regex, (match) => `<mark>${match}</mark>`);
  element.innerHTML = innerHTML;
}

const closeEditPopupBtn = document.getElementById("closeEditPopup");
if (closeEditPopupBtn) {
  closeEditPopupBtn.addEventListener("click", function () {
    hideOverlay();
    document.getElementById("editProductPopup").style.display = "none";
    document.getElementById("error-message-edit").innerText = "";
  });
}

const productEditBtn = document.querySelectorAll(".edit-btn");
productEditBtn.forEach((btn) => {
  btn.addEventListener("click", function () {
    showOverlay();
    const productId = btn.getAttribute("data-edit-product");

    getProductDetails(productId).then((product) => {
      console.log(product.data.product.name);
      const editProductName = document.getElementById("editProductName");
      const editProductDesc = document.getElementById("editProductDesc");
      const editProductPrice = document.getElementById("editProductPrice");
      const editProductAvailability = document.getElementById("editProductAvailability");
      const editSubmit = document.getElementById("editSubmit");

      if (product) {
        editProductName.value = product.data.product.name;
        editProductDesc.value = product.data.product.description;
        editProductPrice.value = product.data.product.price;
        editProductAvailability.value = product.data.product.quantity;
        editSubmit.setAttribute("data-orig-name", product.data.product.name);
        editSubmit.setAttribute("data-orig-desc", product.data.product.description);
        editSubmit.setAttribute("data-orig-price", product.data.product.price);
        editSubmit.setAttribute("data-orig-quan", product.data.product.quantity);
      }
      document.getElementById("editProductPopup").style.display = "block";

      const hiddenInput = document.getElementById("editProductId");
      hiddenInput.value = productId;
    });
  });
});

const closeAddPopupBtn = document.getElementById("closeAddPopup");
if (closeAddPopupBtn) {
  closeAddPopupBtn.addEventListener("click", function () {
    hideOverlay();
    document.getElementById("addProductPopup").style.display = "none";
    document.getElementById("error-message-add").innerText = "";
  });
}

const addProductBtn = document.getElementById("addProduct");
if (addProductBtn) {
  addProductBtn.addEventListener("click", function () {
    showOverlay();
    document.getElementById("addProductPopup").style.display = "block";
  });
}

const editSubmitBtn = document.getElementById("editSubmit");
if (editSubmitBtn) {
  editSubmitBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const productId = document.getElementById("editProductId").value;
    const currentProducts = await getAllProducts();

    const originalProductName = event.target.getAttribute("data-orig-name");
    const originalProductDesc = event.target.getAttribute("data-orig-desc");
    const originalProductPrice = event.target.getAttribute("data-orig-price");
    const originalProductAvailability = event.target.getAttribute("data-orig-quan");

    let editProductNameElem = document.getElementById("editProductName");
    let editProductDescElem = document.getElementById("editProductDesc");
    let editProductPriceElem = document.getElementById("editProductPrice");
    let editProductAvailabilityElem = document.getElementById("editProductAvailability");

    if (editProductNameElem && editProductDescElem && editProductPriceElem && editProductAvailabilityElem) {
      const editProductName = editProductNameElem.value;
      const editProductDesc = editProductDescElem.value;
      const editProductPrice = editProductPriceElem.value;
      const editProductAvailability = editProductAvailabilityElem.value;
      
      if (editProductName.trim() === "" || editProductDesc.trim() === "" || isNaN(editProductPrice) || isNaN(editProductAvailability)) {
        document.getElementById("error-message-edit").innerText = "One or more fields is empty. Please fill in all fields.";
      } else if (
        editProductName == originalProductName &&
        editProductDesc == originalProductDesc &&
        editProductPrice == originalProductPrice &&
        editProductAvailability === originalProductAvailability
      ) {
        document.getElementById("error-message-edit").innerText = "No changes detected. Please make changes to update product.";
      } else if (editProductPrice <= 0) {
        document.getElementById("error-message-edit").innerText = "Price cannot be zero or negative. Please enter a valid price.";
      } else {
        const product = currentProducts.find((product) => product.name.toLowerCase() === editProductNameElem.value.toLowerCase() && product.name.toLowerCase !== originalProductName.toLowerCase);
        if (product) {
          document.getElementById("error-message-edit").innerText = "Product name already exists. Please choose a different name.";
        } else {
          console.log("Edit product");
          const data = {
            name: editProductName,
            description: editProductDesc,
            price: editProductPrice,
            quantity: editProductAvailability,
          };
  
          await editProduct(data, productId);
        }
      }
    }
  });
}

const addSubmitBtn = document.getElementById("addSubmit");
if (addSubmitBtn) {
  addSubmitBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const addProductNameElem = document.getElementById("addProductName");
    const addProductDescElem = document.getElementById("addProductDesc");
    const addProductPriceElem = document.getElementById("addProductPrice");
    const addProductAvailabilityElem = document.getElementById("addProductAvailability");
    const currentProducts = await getAllProducts();

    console.log(currentProducts.find((product) => product.name.toLowerCase() === addProductNameElem.value.toLowerCase()))

    if (addProductNameElem && addProductDescElem && addProductPriceElem && addProductAvailabilityElem) {
      const addProductName = addProductNameElem.value;
      const addProductDesc = addProductDescElem.value;
      const addProductPrice = addProductPriceElem.value;
      const addProductAvailability = addProductAvailabilityElem.value;

      if (addProductName.trim() === "" || addProductDesc.trim() === "" || isNaN(addProductPrice) || isNaN(addProductAvailability)) {
        document.getElementById("error-message-add").innerText = "One or more fields is empty. Please fill in all fields.";
      } else if (addProductPrice <= 0) {
        document.getElementById("error-message-add").innerText = "Price cannot be zero or negative. Please enter a valid price.";
      } else {
        if (currentProducts.find((product) => product.name.toLowerCase() === addProductNameElem.value.toLowerCase())) {
          document.getElementById("error-message-add").innerText = "Product name already exists. Please choose a different name.";
        } else {
          console.log("Add product");

          const data = {
            name: addProductName,
            description: addProductDesc,
            price: addProductPrice,
            quantity: addProductAvailability,
          };
          await addProduct(data);
        }
      }
    }
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

document.getElementById("closePopupSuccess").addEventListener("click", function () {
  document.getElementById("successPopup").style.display = "none";
});

function preventMinus(event) {
  if (event.key === "-") {
    event.preventDefault();
  }
}