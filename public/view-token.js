function showToken() {
    document.getElementById("subsPopup").style.display = "block";
}

function closeToken() {
    document.getElementById("subsPopup").style.display = "none";
}

function showDateTimePopup() {
    closeAllPopups();
    document.getElementById("dateTimePopup").style.display = "block";
}

function closeDateTimePopup() {
    document.getElementById("dateTimePopup").style.display = "none";
}

function submitDateTime() {
    var selectedDate = document.getElementById("bookingDate").value;
    var selectedTime = document.getElementById("bookingTime").value;
    console.log("Selected Date:", selectedDate);
    console.log("Selected Time:", selectedTime);
    closeAllPopups();
}


function closeAllPopups() {
    closeToken();
    closeDateTimePopup();
}
