async function showMoreInformation(
    serviceBookingId,
    ownerId,
    bookingReferenceNumber,
    serviceName
) {
    const userInformation = await getUserInformation(ownerId);
    console.log(userInformation);

    document.getElementById('first-name').textContent =
        userInformation.data.user.firstName;
    document.getElementById('last-name').textContent =
        userInformation.data.user.lastName;
    document.getElementById('user-email').textContent =
        userInformation.data.user.email;
    document.getElementById('booking-reference-number').textContent =
        bookingReferenceNumber;
    document.getElementById('wash-type').textContent = serviceName;

    document.getElementById('showMoreInfoPopup').style.display = 'block';
}
function closeMoreInfoPopup() {
    document.getElementById('showMoreInfoPopup').style.display = 'none';
}

const getUserInformation = async (id) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `/api/v1/users/${id}`,
        });

        return res.data;
    } catch (err) {
        alert(err.response.data.message);
    }
};

async function showUpdateServicePopup(serviceBookingId, ownerId) {
    document.getElementById(`status-form`).style.display = 'block';
    document.getElementById('statusFormHiddenId').value = serviceBookingId;
    document.getElementById('statusFormHiddenOwnerId').value = ownerId;
}
function closeStatusForm() {
    document.getElementById(`status-form`).style.display = 'none';
}
// // function to update service booking
const updateBooking = async (data, id) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `/api/v1/bookings/${id}`,
            data,
        });
    } catch (err) {
        alert(err.response.data.message);
    }
};
// // functiom to update vehicle status by user view
document
    .getElementById('status-change-form')
    .addEventListener('submit', async function (event) {
        event.preventDefault();
        const serviceBookingToUpdateId =
            document.getElementById('statusFormHiddenId').value;
        const serviceOwner = document.getElementById(
            'statusFormHiddenOwnerId'
        ).value;

        var selectElement = document.getElementById('status-select');

        var selectedIndex = selectElement.selectedIndex;
        var selectedValue = selectElement.options[selectedIndex].value;
        var options = selectElement.options;

        // set the text to reflect fast
        document.getElementById(
            `displayBookingStatus${serviceBookingToUpdateId}`
        ).textContent = selectedValue;

        // check if last subscription

        // hide the form

        // update

        var buttonElement = document.getElementById('changeButton');
        buttonElement.disabled = true;

        // update user and the service
        const bookingData = {
            status: selectedValue,
        };

        if (selectedIndex === selectElement.options.length - 1) {
            // if done update the vehicle status to not available
            // remove them from availed services
            const bookingData = {
                status: 'Completed',
            };
            const serviceAvailedData = {
                status: 'Not Available',
            };
            await updateBooking(bookingData, serviceBookingToUpdateId);
            await updateVehicleStatusByPlateNumber(
                serviceAvailedData,
                serviceOwner
            );
            // remove it from users availed service
            console.log(serviceBookingToUpdateId);
            removeBookingFromVehiclesAvailed(serviceBookingToUpdateId);
        } else {
            await updateBooking(bookingData, serviceBookingToUpdateId);

            await updateVehicleStatusByPlateNumber(bookingData, serviceOwner);
        }
    });

const removeBookingFromVehiclesAvailed = async (id) => {
    try {
        const res = await axios({
            method: 'DELETE',
            url: `/api/v1/servicesAvailed/${id}`,
        });
        window.location.reload();
    } catch (err) {
        alert(err.response.data.message);
    }
};
const updateVehicleStatusByPlateNumber = async (data, id) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `/api/v1/vehicles/unit/${id}`,
            data,
        });
    } catch (err) {
        alert(err.response.data.message);
    }
};
function checkStatusChange() {
    var buttonElement = document.getElementById('changeButton');
    buttonElement.disabled = false;
}

// ========================================== SUBSCRIPTION=======================================================

async function showMoreInformationSubscription(
    subscriptionBookingId,
    ownerId,
    stripeReferenceNumber,
    subscriptioName,
    chosenService
) {
    const userInformation = await getUserInformation(ownerId);
    console.log(userInformation);

    document.getElementById('subscription-bookingId').textContent =
        subscriptionBookingId;
    document.getElementById('subscription-name').textContent = subscriptioName;

    document.getElementById('first-name-subscription').textContent =
        userInformation.data.user.firstName;
    document.getElementById('last-name-subscription').textContent =
        userInformation.data.user.lastName;
    document.getElementById('user-email-subscription').textContent =
        userInformation.data.user.email;
    document.getElementById(
        'booking-reference-number-subscription'
    ).textContent = stripeReferenceNumber;
    document.getElementById('wash-type').textContent = chosenService;

    document.getElementById('showMoreInfoPopupSubscription').style.display =
        'block';
}

function closeMoreInfoPopupSubscription() {
    document.getElementById('showMoreInfoPopupSubscription').style.display =
        'none';
}

async function showUpdateServicePopupSubscription(
    subscriptionBookingId,
    ownerId,
    chosenService
) {
    document.getElementById(`status-form-subscription`).style.display = 'block';
    document.getElementById('statusFormHiddenIdSubscription').value =
        subscriptionBookingId;
    document.getElementById('statusFormHiddenChosenService').value =
        chosenService;
    document.getElementById('statusFormHiddenOwnerIdSubscription').value =
        ownerId;
}

function closeStatusFormSubscription() {
    document.getElementById(`status-form-subscription`).style.display = 'none';
}
function checkStatusChangeSubscription() {
    var buttonElement = document.getElementById('changeButtonSubscription');
    buttonElement.disabled = false;
}

document
    .getElementById('status-change-form-subscription')
    .addEventListener('submit', async function (event) {
        event.preventDefault();

        const subscriptionBookingToUpdateId = document.getElementById(
            'statusFormHiddenIdSubscription'
        ).value;
        const subscriptionOwner = document.getElementById(
            'statusFormHiddenOwnerIdSubscription'
        ).value;

        const subscriptionServiceAvailed = document.getElementById(
            'statusFormHiddenChosenService'
        ).value;

        var selectElement = document.getElementById(
            'status-select-subscription'
        );

        var selectedIndex = selectElement.selectedIndex;

        var selectedValue = selectElement.options[selectedIndex].value;
        var options = selectElement.options;

        // set the text to reflect fast
        document.getElementById(
            `displayBookingStatus${subscriptionBookingToUpdateId}`
        ).textContent = selectedValue;

        // check if last subscription

        // hide the form

        // update

        var buttonElement = document.getElementById('changeButtonSubscription');
        buttonElement.disabled = true;

        // update user and the service
        const bookingData = {
            status: selectedValue,
        };

        if (selectedIndex === selectElement.options.length - 1) {
            // if done update the vehicle status to not available
            // remove them from availed services
            alert('finished');
            const bookingData = {
                scheduledDate: null,
                status: 'Not Available',
                chosenService: null,
            };
            const serviceAvailedData = {
                status: 'Not Available',
            };

            await updateSubscriptionBookingStatus(
                bookingData,
                subscriptionBookingToUpdateId
            );
            await updateVehicleStatusByPlateNumber(
                bookingData,
                subscriptionOwner
            );
            // deduct the tokens
            // first fetch the subscription booking id and get the subscriptions

            const subscriptionBookingFound = await getBookingSubscriptionById(
                subscriptionBookingToUpdateId
            );
            console.log(subscriptionBookingFound);
            const listOfSubscriptionDetails =
                subscriptionBookingFound.data.subscriptionBooking
                    .subscriptionDetails;

            console.log(listOfSubscriptionDetails);
            const newData = {
                subscriptionDetails: [],
            };

            // Iterate over the original data
            listOfSubscriptionDetails.forEach((item) => {
                // Create a new object based on the original item
                const newItem = {
                    service: item.service,
                    tokensAmount: item.tokensAmount,
                    _id: item._id,
                };

                // If the service is "MASTER WASH", deduct 1 from tokensAmount
                if (item.service === subscriptionServiceAvailed) {
                    console.log('SIMILAR');
                    newItem.tokensAmount -= 1;
                }

                // Push the new object to the subscriptionDetails array inside newData
                newData.subscriptionDetails.push(newItem);
            });
            console.log('ME IS NEW DATA');
            console.log(newData);

            // update the subscription tokens here
            await updateSubscriptionBookingTokens(
                newData,
                subscriptionBookingToUpdateId
            );
            await updateUserSubscriptionDetails(
                newData,
                subscriptionBookingToUpdateId
            );
            //window.location.reload();

            //update also the user with this
        } else {
            await updateSubscriptionBookingStatus(
                bookingData,
                subscriptionBookingToUpdateId
            );
            await updateVehicleStatusByPlateNumber(
                bookingData,
                subscriptionOwner
            );
        }
    });

// update the booking and update the vehicleStatus
const updateSubscriptionBookingStatus = async (data, id) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `/api/v1/bookings-subscription/${id}`,
            data,
        });
    } catch (err) {
        alert(err.response.data.message);
        console.log('here error patch bookings-subscription');
    }
};

const updateVehicleStatusByPlateNumberSubscription = async (data, id) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `/api/v1/vehicles/unit/${id}`,
            data,
        });
    } catch (err) {
        alert(err.response.data.message);
        console.log('here error patch /api/v1/vehicles/unit/');
    }
};
const getBookingSubscriptionById = async (id) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `/api/v1/bookings-subscription/${id}`,
        });
        return res.data;
    } catch (err) {
        alert(err.response.data.message);
    }
};
const updateSubscriptionBookingTokens = async (data, id) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `/api/v1/bookings-subscription/token/${id}`,
            data,
        });
    } catch (err) {
        console.log('/api/v1/bookings-subscription/token');
        alert(err.response.data.message);
    }
};

const updateUserSubscriptionDetails = async (data, id) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `/api/v1/subscriptionsAvailed/token/${id}`,
            data,
        });
    } catch (err) {
        console.log('/api/v1/subscriptionsAvailed/token/');
        alert(err.response.data.message);
    }
};
