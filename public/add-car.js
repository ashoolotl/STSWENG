document.getElementById("add").addEventListener("click", function () {
  document.getElementById("addCarPopup").style.display = "block";
}); // opening of add car popup

document.getElementById("closePopup").addEventListener("click", function () {
  document.getElementById("addCarPopup").style.display = "none";
}); // closing of add car popup through x button

document.getElementById("addCarForm").addEventListener("submit", function (event) {
  event.preventDefault();
  document.getElementById("addCarPopup").style.display = "none";
  document.getElementById("successPopup").style.display = "block";
}); // when submitted, hide form popup then show success popup

document.getElementById("closeSuccessPopup").addEventListener("click", function () {
  document.getElementById("successPopup").style.display = "none";
}); // closing of success popup through x button

document.getElementById("closeBtn").addEventListener("click", function () {
  document.getElementById("successPopup").style.display = "none";
}); // closing of success popup after clicking done button

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("addCarForm").addEventListener("submit", function (event) {
    event.preventDefault();

    var classType = document.getElementById("classType").value;
    var carBrand = document.getElementById("carBrand").value;
    var carMake = document.getElementById("carMake").value;
    var carModel = document.getElementById("carModel").value;
    var carYear = document.getElementById("carYear").value;
    var plateNumber = document.getElementById("plateNumber").value;

    var hiddenDigits = plateNumber.substring(0, plateNumber.length - 4);
    var visibleDigits = plateNumber.substring(plateNumber.length - 4);
    var hiddenDisplay = "X".repeat(hiddenDigits.length);
    var plateDisplay = hiddenDisplay + visibleDigits;

    var newCarEntry = `
        <div class="car">
          <img src="./images/sedan.png">
          <div class="car-status">
            <div class="car-info">
              <p class="car-text">Status:</p>
              <p class="status">Not Available</p>
            </div>
            <div class="car-info">
              <p class="car-text">Plate Number:</p>
              <p class="status">${plateDisplay}</p>
            </div>
            <div class="car-info">
              <p class="car-text">Contact Person:</p>
              <p class="status">Not Available</p>
            </div>
          </div>
        </div>
        <hr>
      `;

    var addButton = document.getElementById("add");

    addButton.insertAdjacentHTML('beforebegin', newCarEntry);

    document.getElementById("addCarForm").reset();

    document.getElementById("addCarPopup").style.display = "none";
  });
});