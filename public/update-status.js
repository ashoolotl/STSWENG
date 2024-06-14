// Set the initial color of the current status on page load
window.addEventListener('load', function () {
    const currentStatuses = document.querySelectorAll('.status.current');
    currentStatuses.forEach(status => {
        const statusText = status.textContent.toLowerCase();
        status.style.color = getStatusColor(statusText);
        status.addEventListener('click', function (event) {
            showForm(event.target);
        });
    });
});

// Function to handle status change on click
function changeStatus() {
    console.log('Change button clicked');

    // Get the new status from the dropdown
    const newStatus = document.getElementById('status-select').value;

    // Find the status element that was clicked
    const statusElement = document.querySelector('.status.selected');

    // Update the status text and color
    if (statusElement) {
        statusElement.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
        statusElement.style.color = getStatusColor(newStatus);
    }

    // Hide the form after status change
    const form = document.getElementById('status-form');
    if (form) {
        form.style.display = 'none';
    }
}

// Function to show the form when a status is clicked
function showForm(statusElement) {
    // Remove the "selected" class from all status elements
    const allStatuses = document.querySelectorAll('.status');
    allStatuses.forEach(status => {
        status.classList.remove('selected');
    });

    // Add the "selected" class to the clicked status element
    statusElement.classList.add('selected');

    // Get the position of the status element
    const rect = statusElement.getBoundingClientRect();

    // Show the form
    const form = document.getElementById('status-form');
    form.style.display = 'block';

}


// Function to get status color
function getStatusColor(status) {
    switch (status) {
        case 'rejected':
            return 'red';
        case 'on-going':
            return 'blue';
        case 'accepted':
            return 'yellow';
        case 'finished':
            return 'green';
        default:
            return 'inherit';
    }
}

var openPopup = null; // Variable to store the currently open popup

function showMoreInfo(button) {
    // Close the previously opened popup if exists
    if (openPopup !== null) {
        openPopup.style.display = 'none';
    }

    // Find the closest popup relative to the clicked button
    var popup = button.parentNode.querySelector('.popupContainer');
    popup.style.display = 'block';

    // Update the currently open popup
    openPopup = popup;
}

function closeMoreInfoPopup(closeButton) {
    // Find the closest popup relative to the clicked close button
    var popup = closeButton.parentNode.parentNode;
    popup.style.display = 'none';

    // Reset the currently open popup
    openPopup = null;
}




function sortBookings() {
    var sortBy = document.getElementById("order-date-select").value;

    var carsContainer = document.querySelector(".registered-cars");
    var cars = Array.from(document.querySelectorAll(".car"));
    var hrTags = Array.from(document.querySelectorAll(".car-hr"));

    // Remove existing hr tags
    hrTags.forEach(function (hr) {
        hr.remove();
    });

    // Remove any additional hr tags outside of car-hr class
    var extraHrTags = Array.from(document.querySelectorAll(".registered-cars > hr"));
    extraHrTags.forEach(function (hr) {
        hr.remove();
    });

    cars.sort(function (a, b) {
        var dateA, dateB;

        if (sortBy === "status") {
            var statusA = a.querySelector(".status").textContent.toLowerCase();
            var statusB = b.querySelector(".status").textContent.toLowerCase();
            console.log("Status A:", statusA);
            console.log("Status B:", statusB);
            return statusA.localeCompare(statusB);
        } else if (sortBy === "order-date") {
            dateA = getOrderDate(a);
            dateB = getOrderDate(b);
            console.log("Date A:", dateA);
            console.log("Date B:", dateB);
        }

        return new Date(dateA) - new Date(dateB);
    });


    cars.forEach(function (car, index) {
        var hr = document.createElement("hr");
        hr.classList.add("car-hr");
        carsContainer.appendChild(hr);

        carsContainer.appendChild(car);

        if (index === cars.length - 1) {
            var hr = document.createElement("hr");
            hr.classList.add("car-hr");
            carsContainer.appendChild(hr);
        }
    });
}

function getOrderDate(carElement) {
    var orderDateText = carElement.querySelector(".car-text strong");
    console.log("Order Date Element:", orderDateText);
    if (!orderDateText) {
        console.error("Order Date Element not found!");
        return null;
    }
    var orderDate = orderDateText.nextSibling.textContent.trim(); // Get the text content of the next sibling
    console.log("Order Date:", orderDate);
    return orderDate;
}


