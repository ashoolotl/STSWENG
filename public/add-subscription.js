document.getElementById("image5").addEventListener("click", function () {
  showOverlay();
  document.getElementById("addSubPopup").style.display = "block";
});

document.getElementById("closePopup").addEventListener("click", function () {
  hideOverlay();
  document.getElementById("addSubPopup").style.display = "none";
});

document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault();
  hideOverlay();
  document.getElementById("addSubPopup").style.display = "none";
});


// Functions to show and hide the overlay
function showOverlay() {
  document.getElementById("overlay").style.display = "block";
}

function hideOverlay() {
  document.getElementById("overlay").style.display = "none";
}

document.addEventListener('DOMContentLoaded', function () {
  const addBtn = document.getElementById('add');
  const form = document.getElementById('form');
  const bottomContainer = document.querySelector('.bottom-container');

  addBtn.addEventListener('click', function () {
    document.getElementById('addSubPopup').style.display = 'block';
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Get form values
    const subscriptionName = document.getElementById('subscriptionName').value;
    const subscriptionDetails = document.getElementById('subscriptionDetails').value;
    const subscriptionDescription = document.getElementById('subscriptionDescription').value;

    const uploadedImage = document.getElementById('uploadImage').files[0];
    const imageUrl = URL.createObjectURL(uploadedImage);

    // Create top item HTML
    const newTopItem = document.createElement('div');
    newTopItem.classList.add('top-item');
    newTopItem.innerHTML = `
       <img src="${imageUrl}"  alt="${subscriptionName}">
      <p>${subscriptionName}</p>
    `;

    // Append top item to the container
    document.querySelector('.top-item-add').before(newTopItem);

    // Create bottom item HTML
    const newBottomItem = document.createElement('div');
    newBottomItem.classList.add('bottom-item');
    newBottomItem.innerHTML = `
    <img src="${imageUrl}"  alt="${subscriptionName}">
      <h2>${subscriptionName}</h2>
      <h3>${subscriptionDetails}</h3>
      <p>${subscriptionDescription}</p>
      <div class="buttons-container">
        <button class="add-to-cart-btn">Add to Cart</button>
        <button class="book-appointment-btn">Book an Appointment</button>
      </div>
    `;

    // Append bottom item to the bottom container
    bottomContainer.appendChild(newBottomItem);

    form.reset();
  });
});
