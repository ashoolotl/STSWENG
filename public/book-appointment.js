function showBookingPopup() {
    closeAllPopups();
    document.getElementById("bookingPopup").style.display = "block";
}

function showAddPopup() {
    closeAllPopups();
    document.getElementById("addPopup").style.display = "block";
}

function closeBookingPopup() {
    document.getElementById("bookingPopup").style.display = "none";
}

function closeAddPopup() {
    document.getElementById("addPopup").style.display = "none";
}

function showDateTimePopup() {
    closeBookingPopup();
    document.getElementById("dateTimePopup").style.display = "block";
}

function showAddDateTimePopup() {
    closeAddPopup();
    document.getElementById("addDateTimePopup").style.display = "block";
}

function closeDateTimePopup() {
    document.getElementById("dateTimePopup").style.display = "none";
}

function closeAddDateTimePopup() {
    document.getElementById("addDateTimePopup").style.display = "none";
}

function submitDateTime() {
    var selectedDate = document.getElementById("bookingDate").value;
    var selectedTime = document.getElementById("bookingTime").value;
    console.log("Selected Date:", selectedDate);
    console.log("Selected Time:", selectedTime);
    closeDateTimePopup();
}

function addToCart() {
    closeAddDateTimePopup();
    document.getElementById("cart").style.display = "block";
}

function addToCartSub() {
    closeAddPopup();
    document.getElementById("cart").style.display = "block";
}

function addMore() {
    closeCartPopup();
}

function closeCartPopup() {
    document.getElementById("cart").style.display = "none";
}

function submitCart() {
    closeCartPopup();
}

function additionalInfoPopup() {
    closeAllPopups();
    console.log("Additional info popup should appear.");
    document.getElementById("additionalInfo").style.display = "block";
}

function closeAllPopups() {
    closeBookingPopup();
    closeAddPopup();
    closeDateTimePopup();
    closeCartPopup();
    closeAddtionalInfoPopup();
}

function closeAddtionalInfoPopup() {
    document.getElementById("additionalInfo").style.display = "none";
}
