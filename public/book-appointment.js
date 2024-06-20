function showBookingPopup() {
    closeAllPopups();
    showOverlay();
    document.getElementById("bookingPopup").style.display = "block";
}

function showAddPopup() {
    closeAllPopups();
    showOverlay();
    document.getElementById("addPopup").style.display = "block";
}

function closeBookingPopup() {
    hideOverlay();
    document.getElementById("bookingPopup").style.display = "none";
}

function closeAddPopup() {
    hideOverlay();
    document.getElementById("addPopup").style.display = "none";
}

function showDateTimePopup() {
    closeBookingPopup();
    showOverlay();
    document.getElementById("dateTimePopup").style.display = "block";
}

function showAddDateTimePopup() {
    closeAddPopup();
    showOverlay();
    document.getElementById("addDateTimePopup").style.display = "block";
}

function closeDateTimePopup() {
    hideOverlay();
    document.getElementById("dateTimePopup").style.display = "none";
}

function closeAddDateTimePopup() {
    hideOverlay();
    document.getElementById("addDateTimePopup").style.display = "none";
}

function submitDateTime() {
    var selectedDate = document.getElementById("bookingDate").value;
    var selectedTime = document.getElementById("bookingTime").value;
    console.log("Selected Date:", selectedDate);
    console.log("Selected Time:", selectedTime);
    closeDateTimePopup();
    hideOverlay();
}

function addToCart() {
    closeAddDateTimePopup();
    showOverlay();
    document.getElementById("cart").style.display = "block";
}

function addToCartSub() {
    closeAddPopup();
    showOverlay();
    document.getElementById("cart").style.display = "block";
}

function addMore() {
    closeCartPopup();
}

function closeCartPopup() {
    hideOverlay();
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
    hideOverlay();
    document.getElementById("additionalInfo").style.display = "none";
}

function showOverlay() {
    document.getElementById("overlay").style.display = "block";
}

function hideOverlay() {
    document.getElementById("overlay").style.display = "none";
}
