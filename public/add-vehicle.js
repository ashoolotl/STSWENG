document.getElementById("add").addEventListener("click", function () {
  showOverlay();
  document.getElementById("addCarPopup").style.display = "block";
}); // opening of add car popup

document.getElementById("closePopup").addEventListener("click", function () {
  hideOverlay();
  document.getElementById("addCarPopup").style.display = "none";
}); // closing of add car popup through x button

document.getElementById("addCarForm").addEventListener("submit", function (event) {
  event.preventDefault();
  document.getElementById("addCarPopup").style.display = "none";
  document.getElementById("successPopup").style.display = "block";
}); // when submitted, hide form popup then show success popup

document.getElementById("closeSuccessPopup").addEventListener("click", function () {
  hideOverlay();
  document.getElementById("successPopup").style.display = "none";
}); // closing of success popup through x button

document.getElementById("closeBtn").addEventListener("click", function () {
  hideOverlay();
  document.getElementById("successPopup").style.display = "none";
}); // closing of success popup after clicking done button

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("addCarForm").addEventListener("submit", function (event) {
    event.preventDefault();

    var classType = document.getElementById("vehicleName").value;
    const uploadedImage = document.getElementById('uploadImage').files[0];
    const imageUrl = URL.createObjectURL(uploadedImage);

    var newCarEntry = `
        <div class="car">
        <img src="${imageUrl}">
      <div class="car-status">
        <div class="car-info">
              <p class="car-text">${classType}</p>
          </div>
      </div>    
    </div>
    <hr>
      `;

    var addButton = document.getElementById("add");

    addButton.insertAdjacentHTML('beforebegin', newCarEntry);

    document.getElementById("addCarForm").reset();
    hideOverlay();
    document.getElementById("addCarPopup").style.display = "none";
  });
});

function showOverlay() {
  document.getElementById("overlay").style.display = "block";
}

function hideOverlay() {
  document.getElementById("overlay").style.display = "none";
}