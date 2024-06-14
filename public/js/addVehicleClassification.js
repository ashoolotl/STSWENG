// this function is used to create a new vehicle classification
const addVehicle = async (data) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/vehicle-classifications',
            data,
        });

        console.log('ako si status');
        console.log(res.data.status);
        if (res.data.status == 'success') {
            document.getElementById('successPopup').style.display = 'block';
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};
// opening of add car popup
document.getElementById('add').addEventListener('click', function () {
    document.getElementById('addCarPopup').style.display = 'block';
});
// closing of add car popup through x button
document.getElementById('closePopup').addEventListener('click', function () {
    document.getElementById('addCarPopup').style.display = 'none';
});
// closing of success popup through x button
document
    .getElementById('closeSuccessPopup')
    .addEventListener('click', function () {
        document.getElementById('successPopup').style.display = 'none';
        window.location.reload();
    });
// closing of success popup after clicking done button
document.getElementById('closeBtn').addEventListener('click', function () {
    document.getElementById('successPopup').style.display = 'none';
    window.location.reload();
});

// add a new vehicle classification on submit
document
    .getElementById('addCarForm')
    .addEventListener('submit', function (event) {
        event.preventDefault();
        document.getElementById('addCarPopup').style.display = 'none';

        // create a form data since we are uploading photo
        const form = new FormData();
        form.append(
            'name',
            document.getElementById('vehicleClassification').value
        );
        form.append('photo', document.getElementById('photo').files[0]);
        addVehicle(form);
    });

// this function is used to update vehicle classification
const updateVehicleClassification = async (data, id) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `/api/v1/vehicle-classifications/${id}`,
            data,
        });

        console.log(res.data.status);
        if (res.data.status == 'success') {
            //document.getElementById('successPopup').style.display = 'block';
            document.getElementById('successPopupEdit').style.display = 'block';
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};

// edit a vehicle classification on submit
document
    .getElementById('editCarForm')
    .addEventListener('submit', function (event) {
        event.preventDefault();
        document.getElementById('editCarPopup').style.display = 'none';
        const form = new FormData();
        form.append(
            'name',
            document.getElementById('vehicleClassificationEdit').value
        );
        var id = document.getElementById('vehicleClassId').value;
        var fileInput = document.getElementById('photoEdit');
        // Check if any file is selected
        if (fileInput.files && fileInput.files[0]) {
            // An image is uploaded
            form.append('photo', document.getElementById('photoEdit').files[0]);
        }

        updateVehicleClassification(form, id);
    });

// closing of edit car popup through x button
document
    .getElementById('closePopupEdit')
    .addEventListener('click', function () {
        document.getElementById('editCarPopup').style.display = 'none';
    });
// closing of success popup through x button
document
    .getElementById('closeSuccessPopupEdit')
    .addEventListener('click', function () {
        document.getElementById('successPopupEdit').style.display = 'none';
        window.location.reload();
    });
// closing of success popup after clicking done button
document.getElementById('closeBtnEdit').addEventListener('click', function () {
    document.getElementById('successPopupEdit').style.display = 'none';
    window.location.reload();
});

const deleteVehicleClassification = async (id) => {
    try {
        const res = await axios({
            method: 'DELETE',
            url: `/api/v1/vehicle-classifications/${id}`,
        });
        console.log(res.data.status);
        if (res.data.status === undefined) {
            //document.getElementById('successPopup').style.display = 'block';
            alert('Vehicle Classification Successfully deleted');
            window.location.reload();
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};
// this function is used to get all vehicle classifications
const getAllVehicleClassification = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/vehicle-classifications',
        });

        return res.data;
    } catch (err) {
        alert(err.response.data.message);
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    const editButtons = document.querySelectorAll(
        '#vehicleClassificationEditBtn'
    );
    const deleteButtons = document.querySelectorAll(
        '#vehicleClassificationDeleteBtn'
    );

    const vehicleClassifications = await getAllVehicleClassification();
    console.log(vehicleClassifications);
    editButtons.forEach((button) => {
        button.addEventListener('click', function () {
            const vehicle =
                vehicleClassifications.data.vehicleClassification.find(
                    (vehicle) => vehicle._id === this.dataset.id
                );

            // display the popup to edit

            if (vehicle) {
                document.getElementById('editCarPopup').style.display = 'block';
                document.getElementById('vehicleClassificationEdit').value =
                    vehicle.name;
                document.getElementById('vehicleClassId').value = vehicle._id;
            }
        });
    });

    deleteButtons.forEach((button) => {
        button.addEventListener('click', function () {
            const vehicle =
                vehicleClassifications.data.vehicleClassification.find(
                    (vehicle) => vehicle._id === this.dataset.id
                );
            deleteVehicleClassification(vehicle._id);
        });
    });
});
