// this function is used to get all subscriptions
const getAllSubscriptions = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/subscriptions',
        });

        return res.data;
    } catch (err) {
        alert(err.response.data.message);
    }
};
const updateSubscription = async (data, id) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `/api/v1/subscriptions/${id}`,
            data,
        });
        console.log(res.data.status);
        if (res.data.status == 'success') {
            alert('update successful');
            window.location.reload();
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};
const addSubscription = async (data) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/subscriptions',
            data,
        });
        console.log(res.data.status);
        if (res.data.status == 'success') {
            alert('success');
            window.location.reload();
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};

document.getElementById('add').addEventListener('click', function () {
    showOverlay();
    document.getElementById('addSubPopup').style.display = 'block';
});

document.getElementById('closePopup').addEventListener('click', function () {
    hideOverlay();
    document.getElementById('addSubPopup').style.display = 'none';
});

document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('photo', document.getElementById('photo').files[0]);

    const prices = [];
    const services = [];
    const vehicleClassifications = [];

    const checkboxesServices = document.querySelectorAll(
        'input[type="checkbox"][name="selectedItems"]:checked'
    );
    checkboxesServices.forEach((checkbox) => {
        const serviceName = checkbox.value;
        const tokenInput = checkbox.parentElement.querySelector(
            'input[name="token"]'
        );
        const tokensAmount = parseInt(tokenInput.value);

        services.push({
            service: serviceName,
            tokensAmount: tokensAmount,
        });
    });

    const checkBoxesVehicleClass = document.querySelectorAll(
        'input[type="checkbox"][name="selectedItemsVehicleClass"]:checked'
    );
    checkBoxesVehicleClass.forEach((checkbox) => {
        const vehicleClassName = checkbox.value;
        const priceInput = checkbox.parentElement.querySelector(
            'input[name="price"]'
        );
        const priceAmount = Number(priceInput.value);

        vehicleClassifications.push({
            vehicleClassification: vehicleClassName,
            price: priceAmount,
        });
    });

    prices.push({ services, vehicleClassifications });

    prices.forEach((price, index) => {
        price.services.forEach((service, serviceIndex) => {
            formData.append(
                `prices[${index}][services][${serviceIndex}][service]`,
                service.service
            );
            formData.append(
                `prices[${index}][services][${serviceIndex}][tokensAmount]`,
                service.tokensAmount
            );
        });

        price.vehicleClassifications.forEach((vehicle, vehicleIndex) => {
            formData.append(
                `prices[${index}][vehicleClassifications][${vehicleIndex}][vehicleClassification]`,
                vehicle.vehicleClassification
            );
            formData.append(
                `prices[${index}][vehicleClassifications][${vehicleIndex}][price]`,
                vehicle.price
            );
        });
    });

    console.log(prices);
    // Append the prices array to formData under prices field
    addSubscription(formData);
    // console.log(prices);
    // hideOverlay();
    // document.getElementById('addSubPopup').style.display = 'none';

    // write the code here
});

// Functions to show and hide the overlay
function showOverlay() {
    document.getElementById('overlay').style.display = 'block';
}

function hideOverlay() {
    document.getElementById('overlay').style.display = 'none';
}
const deleteSubscription = async (id) => {
    try {
        const res = await axios({
            method: 'DELETE',
            url: `/api/v1/subscriptions/${id}`,
        });
        console.log(res.data.status);
        if (res.data.status === undefined) {
            //document.getElementById('successPopup').style.display = 'block';
            alert('Subscription Successfully deleted');
            window.location.reload();
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};
document.addEventListener('DOMContentLoaded', async () => {
    // for each edit and delete buttons
    const editButtons = document.querySelectorAll('#subscriptionEditBtn');
    const deleteButtons = document.querySelectorAll('#subscriptionDeleteBtn');

    // fetch all subscriptions
    const subscriptions = await getAllSubscriptions();
    console.log(subscriptions);
    editButtons.forEach((button) => {
        button.addEventListener('click', function () {
            // find the subscription with the matching subscription_id == this.dataset.id
            const subscription = subscriptions.data.subscriptions.find(
                (subscription) => subscription._id === this.dataset.id
            );
            document.getElementById('subscriptionId').value = subscription._id;
            // show the popup
            document.getElementById('editSubPopup').style.display = 'block';
            // fill up the form data with the subscription details
            document.getElementById('nameEdit').value = subscription.name;

            // get all checkboxes
            const checkboxesServices = document.querySelectorAll(
                'input[type="checkbox"][name="selectedItemsEdit"]'
            );

            // check the current selections and place the input value of the tokens
            checkboxesServices.forEach(function (checkbox) {
                // make sure that the checked is the previous selection
                for (price of subscription.prices) {
                    for (service of price.services) {
                        if (checkbox.id == service.service) {
                            checkbox.checked = true;
                        }
                    }
                }
            });
            // set the tokens input
            const tokenInputs = document.querySelectorAll(
                'input[type="number"][name="tokenEdit"]'
            );
            tokenInputs.forEach(function (input) {
                // Access attributes of each input element
                for (price of subscription.prices) {
                    for (service of price.services) {
                        if (input.id == service.service) {
                            input.value = service.tokensAmount;
                        }
                    }
                }
            });
            const checkboxesVehicleClass = document.querySelectorAll(
                'input[type="checkbox"][name="selectedItemsEditVehicleClass"]'
            );

            checkboxesVehicleClass.forEach(function (checkbox) {
                for (price of subscription.prices) {
                    for (vehicleClass of price.vehicleClassifications) {
                        if (checkbox.id == vehicleClass.vehicleClassification) {
                            checkbox.checked = true;
                        }
                    }
                }
            });
            // Select all input elements with type 'number' and name 'priceEdit'
            const priceInputs = document.querySelectorAll(
                'input[type="number"][name="priceEdit"]'
            );
            // set the prices
            priceInputs.forEach(function (input) {
                // Access attributes of each input element
                for (price of subscription.prices) {
                    for (service of price.vehicleClassifications) {
                        if (input.id == service.vehicleClassification) {
                            input.value = service.price;
                        }
                    }
                }
            });
        });
    });

    // delete functionality
    deleteButtons.forEach((button) => {
        button.addEventListener('click', function () {
            const subscription = subscriptions.data.subscriptions.find(
                (subscription) => subscription._id === this.dataset.id
            );

            deleteSubscription(subscription._id);
        });
    });
});

// close edit popup
document
    .getElementById('closePopupEdit')
    .addEventListener('click', function () {
        hideOverlay();
        document.getElementById('editSubPopup').style.display = 'none';
    });

document
    .getElementById('formEdit')
    .addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('name', document.getElementById('nameEdit').value);
        var fileInput = document.getElementById('photoEdit');
        // Check if any file is selected
        if (fileInput.files && fileInput.files[0]) {
            // An image is uploaded
            formData.append(
                'photo',
                document.getElementById('photoEdit').files[0]
            );
        }
        const prices = [];
        const services = [];
        const vehicleClassifications = [];

        const checkboxesServices = document.querySelectorAll(
            'input[type="checkbox"][name="selectedItemsEdit"]:checked'
        );
        checkboxesServices.forEach((checkbox) => {
            const serviceName = checkbox.value;
            const tokenInput = checkbox.parentElement.querySelector(
                'input[name="tokenEdit"]'
            );
            const tokensAmount = parseInt(tokenInput.value);

            services.push({
                service: serviceName,
                tokensAmount: tokensAmount,
            });
        });

        const checkBoxesVehicleClass = document.querySelectorAll(
            'input[type="checkbox"][name="selectedItemsEditVehicleClass"]:checked'
        );
        checkBoxesVehicleClass.forEach((checkbox) => {
            const vehicleClassName = checkbox.value;
            const priceInput = checkbox.parentElement.querySelector(
                'input[name="priceEdit"]'
            );
            const priceAmount = Number(priceInput.value);

            vehicleClassifications.push({
                vehicleClassification: vehicleClassName,
                price: priceAmount,
            });
        });

        prices.push({ services, vehicleClassifications });

        prices.forEach((price, index) => {
            price.services.forEach((service, serviceIndex) => {
                formData.append(
                    `prices[${index}][services][${serviceIndex}][service]`,
                    service.service
                );
                formData.append(
                    `prices[${index}][services][${serviceIndex}][tokensAmount]`,
                    service.tokensAmount
                );
            });

            price.vehicleClassifications.forEach((vehicle, vehicleIndex) => {
                formData.append(
                    `prices[${index}][vehicleClassifications][${vehicleIndex}][vehicleClassification]`,
                    vehicle.vehicleClassification
                );
                formData.append(
                    `prices[${index}][vehicleClassifications][${vehicleIndex}][price]`,
                    vehicle.price
                );
            });
        });
        var id = document.getElementById('subscriptionId').value;

        // console.log(prices);
        updateSubscription(formData, id);
    });
