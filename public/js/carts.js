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

document.addEventListener("DOMContentLoaded", function () {
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
});
