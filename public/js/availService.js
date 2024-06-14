const getAvailedService = async (id) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `/api/v1/servicesAvailed/${id}`,
        });
        return res.data;
    } catch (err) {
        alert(err.response.data.message);
    }
};
const getVehicleById = async (id) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `/api/v1/vehicles/vehicle/${id}`,
        });
        return res.data;
    } catch (err) {
        alert(err.response.data.message);
    }
};

const updateBooking = async (data, id) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `/api/v1/bookings/${id}`,
            data,
        });
        console.log(res.status);
        console.log(res.status.data);
    } catch (err) {
        alert(err.response.data.message);
    }
};
const updateVehicleStatus = async (data, id) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `/api/v1/vehicles/${id}`,
            data,
        });
        if (res.data.status === 'success') {
            window.location.reload();
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};

async function showPopupService(serviceId) {
    // Here you can use the serviceId as needed
    const service = await getAvailedService(serviceId);
    const vehicle = await getVehicleById(
        service.data.serviceAvailed.plateNumber
    );
    console.log(service);
    document.getElementById(
        'servicePopupRemainingTokens'
    ).textContent = `Remaining Tokens: ${service.data.serviceAvailed.tokensAmount}`;
    document.getElementById(
        'servicePopupPlateNumber'
    ).textContent = `Plate Number: ${service.data.serviceAvailed.plateNumber}`;
    document.getElementById('serviceBookingId').value =
        service.data.serviceAvailed._id;
    var image = document.getElementById('servicePopupImg');
    image.src = `/images/services/${service.data.serviceAvailed.product}.jpeg`;

    if (vehicle.data.vehicle[0].status != 'Not Available') {
        alert('The vehicle is already in an appointment');
    } else {
        document.getElementById('servicePopup').style.display = 'block';
    }
}
function closePopupService() {
    document.getElementById('servicePopup').style.display = 'none';
}
function showDateTimePopupService() {
    document.getElementById('servicePopup').style.display = 'none';
    document.getElementById('dateTimePopupService').style.display = 'block';
}

function closeDateTimePopupService() {
    document.getElementById('dateTimePopupService').style.display = 'none';
}

function validateTime() {
    var bookingTime = document.getElementById('bookingTime').value;
    if (bookingTime < '09:00' || bookingTime > '17:00') {
        alert('Please select a time between 9:00 AM and 5:00 PM.');
        document.getElementById('bookingTime').value = '09:00';
    }
}

async function submitDateTimeServiceBooking() {
    alert('Your booking is now accepted');
    document.getElementById('dateTimePopupService').style.display = 'none';

    // if the booking is now accepted, update the BOOKING DATABASE AS WELL AS DATE IN THE VEHICLE
    const bookingId = document.getElementById('serviceBookingId').value;

    const service = await getAvailedService(bookingId);

    const dateInput = document.getElementById('bookingDate').value;
    const timeInput = document.getElementById('bookingTime').value;
    const dateTimeString = dateInput + 'T' + timeInput + ':00';
    const bookingData = {
        scheduledDate: dateTimeString,
        status: 'Waiting for vehicle',
    };

    updateBooking(bookingData, service.data.serviceAvailed.bookingId);

    // update the fucking vehicle

    const vehicle = await getVehicleById(
        service.data.serviceAvailed.plateNumber
    );

    var date = new Date(dateInput + 'T' + timeInput + ':00');

    // Format the date
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

    console.log('Appointment on ' + formattedDate);

    const vehicleData = {
        status: `Appointment on ${formattedDate}`,
    };

    updateVehicleStatus(vehicleData, vehicle.data.vehicle[0]._id);
}
