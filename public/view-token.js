function showToken() {
    showOverlay();
    document.getElementById("subsPopup").style.display = "block";
}

function closeToken() {
    hideOverlay();
    document.getElementById("subsPopup").style.display = "none";
}

function showDateTimePopup() {
    closeAllPopups();
    showOverlay();
    document.getElementById("dateTimePopup").style.display = "block";
}

function closeDateTimePopup() {
    hideOverlay();
    document.getElementById("dateTimePopup").style.display = "none";
}

function submitDateTime() {
    var selectedDate = document.getElementById("bookingDate").value;
    var selectedTime = document.getElementById("bookingTime").value;
    console.log("Selected Date:", selectedDate);
    console.log("Selected Time:", selectedTime);
    closeAllPopups();
    hideOverlay();
}


function closeAllPopups() {
    closeToken();
    closeDateTimePopup();
}

function showOverlay() {
    document.getElementById("overlay").style.display = "block";
}
  
function hideOverlay() {
    document.getElementById("overlay").style.display = "none";
}
