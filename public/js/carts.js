const removeItemInCart = async (id) => {
    try {
        const res = await axios({
            method: 'DELETE',
            url: `/api/v1/carts/${id}`,
        });

        if (res.data.status == undefined) {
            alert('Item successfully removed in cart');
            window.location.reload();
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};
const getCheckoutSession = async (id) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `/api/v1/bookings/checkout-session/${id}`,
        });
        window.location.href = res.data.session.url;
    } catch (err) {
        alert(err.response.data.message);
    }
};
document.addEventListener('DOMContentLoaded', function () {
    // Get the element by its ID
    var removeItems = document.querySelectorAll('.removeItem');

    removeItems.forEach(function (removeItem) {
        removeItem.addEventListener('click', function () {
            var dataId = this.dataset.id;

            removeItemInCart(this.dataset.id);
        });
    });

    // bookings
    var proceedButton = document.getElementById('proceed-to-payment');

    proceedButton.addEventListener('click', function () {
        var checkedCount = document.querySelectorAll(
            '.checkmark-container input[type="checkbox"]:checked'
        ).length;

        if (checkedCount === 0) {
            alert('please select item to proceed to checkout');
        } else {
            var owner = document.getElementById('ownerCartId').value;
            getCheckoutSession(owner);
        }
        // continue
    });
});
