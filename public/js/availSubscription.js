const createPayment = async (data, id) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `/api/v1/bookings/checkout-subscription/${id}`,
            data,
        });
        window.location.href = res.data.session.url;
    } catch (err) {
        alert(err);
    }
};
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

const getAllVehicleByOwner = async (id) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `/api/v1/vehicles/${id}`,
        });

        return res.data;
    } catch (err) {
        alert(err.response.data.message);
    }
};

async function showSubscriptionPopup(
    subscriptionId,
    userId,
    subscriptionName,
    subscriptionDescription
) {
    const vehiclesOwned = await getAllVehicleByOwner(userId);
    if (vehiclesOwned.data.vehicle.length == 0) {
        alert('Please add a vehicle first before availing this subscription');
    } else {
        const subscriptions = await getAllSubscriptions();
        console.log(vehiclesOwned);
        //console.log(subscriptions);

        let selectedSubscriptionData = subscriptions.data.subscriptions.find(
            (sub) => sub.name === subscriptionName
        );
        console.log(selectedSubscriptionData.prices);

        let subscriptionPrices = selectedSubscriptionData.prices;

        const generateSubscriptionForVehicle = [];
        vehiclesOwned.data.vehicle.forEach((ownedVehicle) => {
            // Find the corresponding price for the owned vehicle classification
            let matchingPrice = null;
            subscriptionPrices.forEach((price) => {
                price.vehicleClassifications.forEach((vc) => {
                    if (
                        vc.vehicleClassification === ownedVehicle.classification
                    ) {
                        matchingPrice = vc.price;
                    }
                });
            });
            if (matchingPrice !== null) {
                // console.log(
                //     'Price for',
                //     ownedVehicle.classification + ':',
                //     matchingPrice
                // );
                generateSubscriptionForVehicle.push({
                    classification: ownedVehicle.classification,
                    price: matchingPrice,
                    owner: userId,
                    product: subscriptionName,
                    plateNumber: ownedVehicle.plateNumber,
                    description: subscriptionDescription,
                });
                // Do something with the price...
            } else {
                console.log(
                    'Price for',
                    ownedVehicle.classification + ': Not found'
                );
            }
        });
        if (generateSubscriptionForVehicle.length == 0) {
            alert('This subscription is not available for your vehicle');
        } else {
            console.log(generateSubscriptionForVehicle);
            generateSubscriptionPopup(generateSubscriptionForVehicle);
            document.getElementById('bookingPopup').style.display = 'block';
        }

        // generate the subscription popup
    }

    // first get all the vehicles owned by the user and check first if it is applicable to the subscription

    // const data = {
    //     subscriptionId,
    // };
    // createPayment(data, userId);
}
function generateSubscriptionPopup(vehiclesData) {
    // Get the reference to the hr#generateVehicles element

    const hrElement = document.getElementById('generateVehicleSubscriptions');

    // Get the parent element of the <hr> element
    const parentElement1 = hrElement.parentNode;

    // Get the next sibling of the <hr> element
    let nextSibling = hrElement.nextSibling;

    // Remove all siblings after the <hr> element
    while (nextSibling) {
        const siblingToRemove = nextSibling;
        nextSibling = siblingToRemove.nextSibling; // Update nextSibling before removing it
        parentElement1.removeChild(siblingToRemove); // Remove the sibling element
    }
    // Get the parent element where the generated content will be appended
    const parentElement = document.getElementById(
        'generateVehicleSubscriptions'
    ).parentNode;

    var counter = 0;
    // Iterate over each vehicle data and create corresponding HTML elements
    vehiclesData.forEach((vehicle) => {
        // Create elements
        const popupContent = document.createElement('div');
        popupContent.classList.add('popupContent');

        const contentWrapper = document.createElement('div');
        contentWrapper.classList.add('contentWrapper');

        const inputRadio = document.createElement('input');
        inputRadio.setAttribute('type', 'radio');
        inputRadio.setAttribute('name', 'vehicle');
        inputRadio.setAttribute('value', counter);

        const img = document.createElement('img');
        img.classList.add('bookingPopupImage');
        img.setAttribute(
            'src',
            `/images/vehicleClassification/${vehicle.classification}.jpeg`
        );
        img.setAttribute('alt', `Image for ${vehicle.classification}`);

        const infoItem = document.createElement('div');
        infoItem.classList.add('info-item');
        // add here all the data
        infoItem.setAttribute(`plateNumber${counter}`, vehicle.plateNumber);
        infoItem.setAttribute(`price${counter}`, vehicle.price);
        infoItem.setAttribute(`owner${counter}`, vehicle.owner);
        infoItem.setAttribute(
            `classification${counter}`,
            vehicle.classification
        );
        infoItem.setAttribute(`productName${counter}`, vehicle.product);
        infoItem.setAttribute(
            `subscriptionDescription${counter}`,
            vehicle.description
        );

        const plateNumber = document.createElement('span');
        plateNumber.classList.add('bookingPopupPlateNumber');
        plateNumber.innerHTML = `<strong>Plate Number:</strong> ${vehicle.plateNumber}`;

        const price = document.createElement('span');
        price.classList.add('bookingPopupPrice');
        price.innerHTML = `<strong>Price:</strong> €${vehicle.price}`;

        // Append elements to their respective parents
        infoItem.appendChild(plateNumber);
        infoItem.appendChild(price);

        contentWrapper.appendChild(inputRadio);
        contentWrapper.appendChild(img);
        contentWrapper.appendChild(infoItem);

        popupContent.appendChild(contentWrapper);

        // Append popupContent to the parent element
        parentElement.appendChild(popupContent);

        // Append HR element after each popupContent
        const hr = document.createElement('hr');
        parentElement.appendChild(hr);
        counter++;
    });
    var radioButtons = document.querySelectorAll(
        'input[type="radio"][name="vehicle"]'
    );

    // Check if there are any radio buttons
    if (radioButtons.length > 0) {
        // Mark the first radio button as checked
        radioButtons[0].checked = true;
    }
    const button = document.createElement('button');
    button.setAttribute('type', 'submit');
    button.textContent = 'Proceed to Payment';

    // Append button to the parent element
    parentElement.appendChild(button);
}

document
    .getElementById('availSubscriptionForm')
    .addEventListener('submit', function (event) {
        event.preventDefault();

        var selectedVehicle = document.querySelector(
            'input[type="radio"][name="vehicle"]:checked'
        );

        var infoItem = document.querySelector(
            `[plateNumber${selectedVehicle.value}]`
        );
        var plateNumber = infoItem.getAttribute(
            `plateNumber${selectedVehicle.value}`
        );
        var price = infoItem.getAttribute(`price${selectedVehicle.value}`);
        var owner = infoItem.getAttribute(`owner${selectedVehicle.value}`);
        var classification = infoItem.getAttribute(
            `classification${selectedVehicle.value}`
        );
        var productName = infoItem.getAttribute(
            `productName${selectedVehicle.value}`
        );
        var productDescription = infoItem.getAttribute(
            `subscriptionDescription${selectedVehicle.value}`
        );

        const subscriptionData = {
            price: price,
            owner: owner,
            product: productName,
            plateNumber: plateNumber,
            classification: classification,
            description: productDescription,
        };

        var confirmResult = confirm(
            'The subscription tokens that you will receive after purchasing this can only be used with the vehicle plate number you selected that is linked to your account. Do you still want to proceed?'
        );
        if (confirmResult) {
            createPayment(subscriptionData, owner);
        } else {
            console.log('');
        }
        //console.log(subscriptionData);
    });
function closePopupSubscriptionSelectVehicle() {
    document.getElementById('bookingPopup').style.display = 'none';
}
