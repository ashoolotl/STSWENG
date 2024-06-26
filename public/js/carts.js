const removeItemInCart = async (id) => {
  try {
    const response = await fetch(`/api/v1/carts/${id}`, {
      method: "DELETE",
    });
    const res = await response.json();

    if (res.status === undefined) {
      alert("Item successfully removed from cart");
      window.location.reload();
    }
  } catch (err) {
    alert("Failed to remove item from cart");
  }
};

const getCheckoutSession = async (id) => {
  try {
    const response = await fetch(`/api/v1/bookings/checkout-session/${id}`);
    const res = await response.json();
    window.location.href = res.session.url;
  } catch (err) {
    alert("Failed to initiate checkout session");
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
      alert("please select item to proceed to checkout");
    } else {
      var owner = document.getElementById("ownerCartId").value;
      getCheckoutSession(owner);
    }
    // continue
  });
});
