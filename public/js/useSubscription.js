const getAvailedSubscription = async (id) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `/api/v1/subscriptionsAvailed/${id}`,
        });
        return res.data;
    } catch (err) {
        alert(err.response.data.message);
    }
};
let allService = [];
let subscriptionBookingIdToUpdate = null;
let plateNumberToUpdate = null;
async function showPopupSubscription(subscriptionId) {
    const availedSubscription = await getAvailedSubscription(subscriptionId);
    subscriptionBookingIdToUpdate =
        availedSubscription.data.subscriptionUserAvailed.bookingId;
    plateNumberToUpdate =
        availedSubscription.data.subscriptionUserAvailed.plateNumber;

    console.log(availedSubscription);

    document.getElementById(
        `subscriptionPopupPlateNumber`
    ).textContent = `Subscription for vehicle: ${availedSubscription.data.subscriptionUserAvailed.plateNumber}`;
    document.getElementById(`subscriptionPopup`).style.display = 'block';

    const servicesInsideSubscription =
        availedSubscription.data.subscriptionUserAvailed.subscriptionDetails;

    allService = servicesInsideSubscription;
    console.log(servicesInsideSubscription);
    generateSubscriptionPopup(servicesInsideSubscription);
}
function closePopupSubscription() {
    document.getElementById(`subscriptionPopup`).style.display = 'none';
}

function generateSubscriptionPopup(services) {
    // Step 1: Find the h2#subscriptionPopupPlateNumber element
    const subscriptionPlateNumber = document.getElementById(
        'subscriptionPopupPlateNumber'
    );

    // Clear existing elements next to subscriptionPlateNumber
    let nextElement = subscriptionPlateNumber.nextElementSibling;
    while (nextElement) {
        const siblingToRemove = nextElement;
        nextElement = nextElement.nextElementSibling;
        siblingToRemove.remove();
    }
    let counter = 0;
    // Step 2: Create subscription content dynamically

    for (service of services) {
        const subscriptionPopupServiceName = document.createElement('h2');
        subscriptionPopupServiceName.id = 'subscriptionPopupServiceName';
        subscriptionPopupServiceName.textContent = `${service.service
            .toLowerCase()
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            )} Token Remaining Tokens: ${service.tokensAmount}`;

        const hrElement1 = document.createElement('hr');

        const popupContent = document.createElement('div');
        popupContent.classList.add('popupContent');
        popupContent.setAttribute('data-service-id', counter);

        const plateNumberSpan = document.createElement('span');
        plateNumberSpan.classList.add('bookingPopupPlateNumber');

        const strongElement = document.createElement('strong');
        strongElement.textContent = `Price: 1 ${service.service
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase())} Token`;

        const contentWrapper = document.createElement('div');
        contentWrapper.classList.add('contentWrapper', 'Tokens');

        const imageSelectDiv = document.createElement('div');
        imageSelectDiv.classList.add('image-select');

        const radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.checked = false;
        radioButton.name = 'subscriptionSelected';
        radioButton.value = counter;

        const image = document.createElement('img');
        image.id = 'subscriptionPopupImg';
        image.src = `/images/services/${service.service}.jpeg`;
        image.alt = `Image for ${service.service}`;

        const hiddenInput = document.createElement('input');
        hiddenInput.id = 'subscriptionBookingId';
        hiddenInput.type = 'hidden';

        // Step 3: Append subscription content to the subscriptionPlateNumber element

        plateNumberSpan.appendChild(strongElement);
        contentWrapper.appendChild(imageSelectDiv);
        contentWrapper.appendChild(hiddenInput);
        imageSelectDiv.appendChild(radioButton);
        imageSelectDiv.appendChild(image);
        popupContent.appendChild(plateNumberSpan);
        popupContent.appendChild(contentWrapper);

        subscriptionPlateNumber.insertAdjacentElement('afterend', popupContent);
        subscriptionPlateNumber.insertAdjacentElement('afterend', hrElement1);
        subscriptionPlateNumber.insertAdjacentElement(
            'afterend',
            subscriptionPopupServiceName
        );

        counter++;
    }
    const lastPopupContent = document.querySelector(
        '.popupContent[data-service-id="0"]'
    );

    // Create the button
    const bookingButton = document.createElement('button');
    bookingButton.classList.add('booking');
    bookingButton.textContent = 'Proceed to Booking';
    bookingButton.onclick = showDateTimePopupSubscription; // Assuming showDateTimePopup is your function name
    // Insert the button after the last popupContent div
    lastPopupContent.insertAdjacentElement('afterend', bookingButton);

    // Create the Cancel Subscription button
    const cancelButton = document.createElement('button');
    cancelButton.classList.add('booking');
    cancelButton.textContent = 'Cancel Subscription';
    cancelButton.onclick = cancelSubscription(); // Assuming cancelSubscription is your function name
    cancelButton.style.backgroundColor = '#d9534f'; // Example background color
    cancelButton.style.color = '#fff'; // Example text color
    // Insert the Cancel Subscription button after the booking button
    bookingButton.insertAdjacentElement('afterend', cancelButton);

    // Query all radio buttons with the name "subscriptionRadio"
    const radioButtons = document.querySelectorAll(
        'input[type="radio"][name="subscriptionSelected"]'
    );
    radioButtons[0].checked = true;

    // listen to radio buttons

    radioButtons.forEach(function (radioButton) {
        radioButton.addEventListener('change', function () {
            // Your event handling code here
            console.log('Radio button changed:', radioButton.value);
            console.log(allService[radioButton.value]);
            selectedRadioButton = radioButton.value;
        });
    });
}

function showDateTimePopupSubscription() {
    document.getElementById('subscriptionPopup').style.display = 'none';
    document.getElementById('dateTimePopupSubscription').style.display =
        'block';
}

function closeDateTimePopupSubscription() {
    document.getElementById('dateTimePopupSubscription').style.display = 'none';
}

function cancelSubscription() {}

function validateTime() {
    var bookingTime = document.getElementById('bookingTimeSubscription').value;
    if (bookingTime < '09:00' || bookingTime > '17:00') {
        alert('Please select a time between 9:00 AM and 5:00 PM.');
        document.getElementById('bookingTimeSubscription').value = '09:00';
    }
}
async function submitDateTimeSubscriptionBooking() {
    alert('booking received');
    document.getElementById('dateTimePopupSubscription').style.display = 'none';
    const dateInput = document.getElementById('bookingDateSubscription').value;
    const timeInput = document.getElementById('bookingTimeSubscription').value;
    const dateTimeString = dateInput + 'T' + timeInput + ':00.000+00:00';

    // update the bookingSubscriptions collection with the bookingId

    // update the user vehicle status
    var date = new Date(dateInput + 'T' + timeInput + ':00');
    var options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    };
    var formattedDate = date.toLocaleDateString('en-US', options);

    const vehicleData = {
        status: `Appointment on ${formattedDate}`,
    };

    console.log(allService);

    // the chosen service add here

    const radioButtons = document.querySelectorAll(
        'input[type="radio"][name="subscriptionSelected"]'
    );
    let selectedproduct;

    // Iterate through radioButtons to find the selected one
    radioButtons.forEach((radioButton) => {
        if (radioButton.checked) {
            selectedproduct = radioButton.value;
        }
    });

    const newBookingSubscription = {
        scheduledDate: dateTimeString,
        status: 'Waiting for vehicle',
        chosenService: allService[selectedproduct].service,
    };
    //alert(allService[selectedproduct].service);
    await updateSubscriptionsBooking(
        newBookingSubscription,
        subscriptionBookingIdToUpdate
    );
    await updateUserVehicleStatus(vehicleData, plateNumberToUpdate);
}

const updateUserVehicleStatus = async (data, id) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `/api/v1/vehicles/unit/${id}`,
            data,
        });
        if (res.data.status === 'success') {
            window.location.reload();
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};

const updateSubscriptionsBooking = async (data, id) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `/api/v1/bookings-subscription/${id}`,
            data,
        });
        if (res.data.status === 'success') {
            window.location.reload();
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};
