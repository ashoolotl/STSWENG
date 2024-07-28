const removeItemInCart = async (id) => {
  try {
    const response = await fetch(`/api/v1/carts/${id}`, {
      method: "DELETE",
    });

    if (response.status === 200 || response.status === 204) {
      document.getElementById("successPopup").style.display = "block";
      document.getElementById("successText").innerText = "Item successfully removed from cart. Refreshing page...";
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  } catch (err) {
    console.error(err.message);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "Failed to remove item from cart. Please try again later.";
  }
};

const getCheckoutSession = async (id) => {
  try {
    const response = await fetch(`/api/v1/bookings/checkout-session/${id}`);
    const res = await response.json();
    window.location.href = res.session.url;
  } catch (err) {
    console.error(err.message);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "Failed to initiate check out session. Please try again later.";
  }
};

const updateDatabaseItems = async () => {
  try {
    const owner = document.getElementById("ownerCartId").value;
    const cartItemsResponse = await fetch(`/api/v1/carts/${owner}`);
    let cartItemsJson = await cartItemsResponse.json();
    let cartItems = cartItemsJson.data.cart;

    for (let item of cartItems) {
      if (item.plateNumber) {
        // update vehicle status To Review
        try {
          await fetch(`/api/v1/vehicles/platenum/${item.plateNumber}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: "To Review",
              lastService: item.product,
            }),
          });
        } catch (err) {
          console.error("Error updating vehicle status for item", item.plateNumber, err);
        }
      }

      // update product stock
      try {
        await fetch(`/api/v1/products/updateStock`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: item.product,
            quantity: -item.quantity,
          }),
        });
      } catch (err) {
        console.error("Error updating product quantity for item", item.product, err);
      }
    }

    // clear cart items
    await fetch(`/api/v1/carts/clear/${owner}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.error("Error processing cart items", err);
  }
};

async function displayPaymentStatus() {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentStatus = urlParams.get("payment");

  if (paymentStatus === "success") {
    await updateDatabaseItems();
    document.getElementById("successPopup").style.display = "block";
    document.getElementById("successText").innerText = "Payment successful. Thank you for your purchase!";
    setTimeout(() => {
      window.location.href = "/carts";
    }, 2000);
  } else if (paymentStatus === "failure") {
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "Payment failed. Please try again.";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  displayPaymentStatus();
  // Get the element by its ID
  var removeItems = document.querySelectorAll(".removeItem");

  removeItems.forEach(function (removeItem) {
    removeItem.addEventListener("click", function () {
      var dataId = this.dataset.id;

      removeItemInCart(this.dataset.id);
    });
  });

  // bookings
  var proceedButton = document.getElementById("proceed-to-booking");
  proceedButton.addEventListener("click", function () {
    var checkedCount = document.querySelectorAll('.checkmark-container input[type="checkbox"]:checked').length;

    if (checkedCount === 0) {
      document.getElementById("errorPopup").style.display = "block";
      document.getElementById("errorText").innerText = "Please select item to proceed to checkout.";
    } else {
      var owner = document.getElementById("ownerCartId").value;
      getCheckoutSession(owner);
    }
    // continue
  });

  const productCartItems = document.querySelector(".productCart");
  const servicesCartItems = document.querySelector(".servicesCart");
  const productCartButton = document.getElementById("productCartTab");
  const servicesCartButton = document.getElementById("servicesCartTab");

  if (productCartButton && productCartItems) {
    productCartButton.addEventListener("click", function () {
      servicesCartButton.classList.remove("selected");
      servicesCartItems.classList.add("hide");

      productCartItems.classList.remove("hide");
      productCartButton.classList.add("selected");
    });
  }

  if (servicesCartButton && servicesCartItems) {
    servicesCartButton.addEventListener("click", function () {
      productCartButton.classList.remove("selected");
      productCartItems.classList.add("hide");

      servicesCartButton.classList.add("selected");
      servicesCartItems.classList.remove("hide");
    });
  }
});
