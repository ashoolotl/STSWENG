// this function is used to get all services
const getAllService = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/services',
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

const addItemToCart = async (data) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `/api/v1/carts`,
            data,
        });

        if (res.data.status == 'success') {
            alert('Item added to cart');
            document.getElementById('bookingPopup').style.display = 'none';
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};
function generateAvailableServices(
    classNameToGenerate,
    vehiclesOwner,
    serviceDetails,
    owner,
    serviceName,
    serviceDescription
) {
    // create a matching vehicles array that contains the platenumber,classification, price
    const matchingVehicles = [];
    vehiclesOwner.forEach((vehicleOwner) => {
        const matchingServiceDetail = serviceDetails.find(
            (serviceDetail) =>
                serviceDetail.vehicleClassification ===
                vehicleOwner.classification
        );

        if (matchingServiceDetail) {
            matchingVehicles.push({
                plateNumber: vehicleOwner.plateNumber,
                classification: vehicleOwner.classification,
                price: matchingServiceDetail.price,
                _id: matchingServiceDetail._id,
            });
        }
    });
    // Remove duplicate elements when generating the available services
    var hrTestElement = document.getElementById('generatePopup');
    var hrElement = document.getElementById('generatePopup');
    var nextElement = hrElement.nextElementSibling;

    // Loop through all siblings after the hr element and remove them
    while (nextElement) {
        if (nextElement.tagName.toLowerCase() !== 'button') {
            var toRemove = nextElement;
            nextElement = nextElement.nextElementSibling;
            toRemove.parentNode.removeChild(toRemove);
        } else {
            // If the next element is the button, stop removing elements
            break;
        }
    }
    // generate the vehicle
    var counter = 0;
    for (vehicle of matchingVehicles) {
        // Get the hr#test element

        // Create the div element for popup content
        var popupContentDiv = document.createElement('div');
        popupContentDiv.classList.add('popupContent');

        // Create the div element for content wrapper
        var contentWrapperDiv = document.createElement('div');
        contentWrapperDiv.classList.add('contentWrapper');

        // Create the input element for radio button
        var radioButtonInput = document.createElement('input');
        radioButtonInput.setAttribute('type', 'radio');
        radioButtonInput.setAttribute('name', 'vehicle');
        radioButtonInput.setAttribute('value', `${counter}`);

        // Create the image element for car image
        var carImage = document.createElement('img');
        carImage.classList.add('bookingPopupImage');
        carImage.setAttribute(
            'src',
            `/images/vehicleClassification/${vehicle.classification}.jpeg`
        );

        carImage.setAttribute('alt', 'Car Image');
        carImage.setAttribute('id', `vehicleClassification${counter}`);
        carImage.setAttribute('data-value', `${vehicle.classification}`);

        // Create the div element for info item
        var infoItemDiv = document.createElement('div');
        infoItemDiv.classList.add('info-item');
        infoItemDiv.setAttribute(`plateNumber${counter}`, vehicle.plateNumber);
        infoItemDiv.setAttribute(`price${counter}`, vehicle.price);
        infoItemDiv.setAttribute(`owner${counter}`, owner);
        infoItemDiv.setAttribute(
            `classification${counter}`,
            vehicle.classification
        );
        infoItemDiv.setAttribute(`serviceName${counter}`, serviceName);
        infoItemDiv.setAttribute(
            `serviceDescription${counter}`,
            serviceDescription
        );

        // Create the span element for plate number
        var plateNumberSpan = document.createElement('span');
        plateNumberSpan.classList.add('bookingPopupPlateNumber');
        plateNumberSpan.innerHTML = `<strong>Plate Number: </strong>${vehicle.plateNumber}`;

        // Create the span element for price
        var priceSpan = document.createElement('span');
        priceSpan.classList.add('bookingPopupPrice');
        priceSpan.innerHTML = `<strong>Price: </strong> €${vehicle.price}`;

        // Append plate number and price spans to info item div
        infoItemDiv.appendChild(plateNumberSpan);
        infoItemDiv.appendChild(priceSpan);

        //make a hidden input which has a service name
        var hiddenServiceName = document.createElement('input');

        // Set attributes for the hidden input
        hiddenServiceName.setAttribute('type', 'hidden');
        hiddenServiceName.setAttribute('name', 'serviceNameHidden'); // Adjust the name as needed
        hiddenServiceName.setAttribute('value', serviceName);
        hiddenServiceName.setAttribute('id', `serviceName${counter}`);
        //make a hidden input which has a service name
        var hiddenOwnerId = document.createElement('input');

        // Set attributes for the hidden input
        hiddenOwnerId.setAttribute('type', 'hidden');
        hiddenOwnerId.setAttribute('value', owner);
        hiddenOwnerId.setAttribute('id', `owner${counter}`);

        // Append input, image, and info item to content wrapper
        contentWrapperDiv.appendChild(radioButtonInput);
        contentWrapperDiv.appendChild(carImage);
        contentWrapperDiv.appendChild(infoItemDiv);

        // Append content wrapper to popup content
        popupContentDiv.appendChild(contentWrapperDiv);

        // Append popup content to hr#test element
        hrTestElement.parentNode.insertBefore(
            popupContentDiv,
            hrTestElement.nextSibling
        );

        var hrElement = document.createElement('hr');
        hrTestElement.parentNode.insertBefore(
            hrElement,
            popupContentDiv.nextSibling
        );
        counter++;
    }

    // make sure that atleast one vehicle is selected
    var radioButtons = document.querySelectorAll(
        'input[type="radio"][name="vehicle"]'
    );

    // Check if there are any radio buttons
    if (radioButtons.length > 0) {
        // Mark the first radio button as checked
        radioButtons[0].checked = true;
    }
}
document.addEventListener('DOMContentLoaded', async () => {
    const addToCartButtons = document.querySelectorAll('#serviceAddToCart');
    const services = await getAllService();
    addToCartButtons.forEach((button) => {
        button.addEventListener('click', async function () {
            const service = services.data.services.find(
                (service) => service._id === this.dataset.id
            );
            var serviceName = service.name;
            var serviceDescription = service.description;

            console.log('VEhicle class list for this service:');
            console.log(service.prices);

            const ownedVehiclesClassificationsName = [];
            const ownedVehiclesData = [];
            // we only want to display the vehicles with a price
            const vehiclesOwned = await getAllVehicleByOwner(
                this.dataset.owner
            );

            for (className of vehiclesOwned.data.vehicle) {
                ownedVehiclesClassificationsName.push(className.classification);
                ownedVehiclesData.push(className);
            }
            console.log('OWNER OWNS THESE VEHICLES');
            console.log(ownedVehiclesData);
            const matchingVehicles = ownedVehiclesClassificationsName.filter(
                (vehicle) => {
                    return service.prices.some(
                        (serviceVehicle) =>
                            serviceVehicle.vehicleClassification === vehicle
                    );
                }
            );
            console.log(matchingVehicles);
            if (vehiclesOwned.data.vehicle.length == 0) {
                alert(
                    'Please add a vehicle first before availing this service'
                );
            } else if (matchingVehicles.length == 0) {
                alert('This service is not applicable to your vehicle');
            } else {
                // create the poup and only show the ownedVehiclesClassifications
                generateAvailableServices(
                    matchingVehicles,
                    ownedVehiclesData,
                    service.prices,
                    this.dataset.owner,
                    serviceName,
                    serviceDescription
                );
                document.getElementById('bookingPopup').style.display = 'block';
            }

            // show the popup
        });
    });
});
document
    .getElementById('addToCart')
    .addEventListener('submit', function (event) {
        // Prevent the default form submission
        event.preventDefault();

        // to get the plate number
        var selectedVehicle = document.querySelector(
            'input[type="radio"][name="vehicle"]:checked'
        );

        // to get the plate number
        var infoItemDiv = document.querySelector(
            `[plateNumber${selectedVehicle.value}]`
        );

        var plateNumber = infoItemDiv.getAttribute(
            `plateNumber${selectedVehicle.value}`
        );
        var price = infoItemDiv.getAttribute(`price${selectedVehicle.value}`);
        var owner = infoItemDiv.getAttribute(`owner${selectedVehicle.value}`);
        var classification = infoItemDiv.getAttribute(
            `classification${selectedVehicle.value}`
        );
        var serviceName = infoItemDiv.getAttribute(
            `serviceName${selectedVehicle.value}`
        );
        var serviceDescription = infoItemDiv.getAttribute(
            `serviceDescription${selectedVehicle.value}`
        );

        const cartData = {
            price: price,
            owner: owner,
            product: serviceName,
            plateNumber: plateNumber,
            classification: classification,
            description: serviceDescription,
        };
        var confirmResult = confirm(
            'The service token that you will receive after purchasing this can only be used with the vehicle plate number you selected that is linked to your account. Do you still want to proceed?'
        );
        if (confirmResult) {
            addItemToCart(cartData);
        } else {
            console.log('');
        }
    });
document
    .getElementById('closePopupBooking')
    .addEventListener('click', function () {
        document.getElementById('bookingPopup').style.display = 'none';
    });
