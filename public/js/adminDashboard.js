const getAllVehicles = async () => {
  try {
    const res = await fetch("/api/v1/vehicles");
    const data = await res.json();
    return data.data.vehicles;
  } catch (error) {
    console.log(error);
  }
};

const getAllReceipts = async () => {
  try {
    const res = await fetch("/api/v1/receipts/all");
    const data = await res.json();
    return data.data.receipts;
  } catch (error) {
    console.log(error);
  }
};

const populateVehicles = (vehicles) => {
  const vehiclesContainer = document.querySelector(".registered-cars");
  vehicles.forEach((vehicle) => {
    const vehicleElement = document.createElement("div");
    vehicleElement.classList.add("car");
    vehicleElement.dataset.carDetails = `${vehicle.classification}-${vehicle.plateNumber}`;
    vehicleElement.innerHTML = `
      <img src="/images/vehicleClassification/${vehicle.classification}.jpeg" alt="Image for ${vehicle.classification}.jpeg">
      <div class="car-status">
        <div class="car-info">
          <p class="car-text"><strong>Owner: </strong>${vehicle.owner}</p>
          <p class="car-text"><strong>Plate Number: </strong>${vehicle.plateNumber}</p>
          <p class="car-text"><strong>Status: </strong><span class="status current">${vehicle.status} ${vehicle.lastService}</span></p>
          <button class="more-info-btn" onclick="showMoreInformation('${vehicle._id}', '${vehicle.owner}', '${vehicle.stripeReferenceNumber}', '${
      vehicle.product
    }')">More Information</button>
          ${vehicle.status === "Pending:" ? '<button class="update-status">Mark Complete</button>' : ""}
        </div>
      </div>
    `;
    vehiclesContainer.appendChild(vehicleElement);
  });
};

const populateReceipts = (receipts) => {
  console.log(receipts);
  const receiptsContainer = document.querySelector(".ordered-products");
  receipts.forEach((receipt) => {
    receipt.products.forEach((product) => {
      const receiptElement = document.createElement("div");
      receiptElement.classList.add("dashboardProduct");
      receiptElement.innerHTML = `
      <img src="/images/products/${product.photo}">
      <div class="order-details">
        Name: <span id="product-name">${product.name}</span>
        Quantity: <span id="product-quantity">x${product.quantity}</span>
      </div>
      <div class="order-details">
        Status: <span id="product-status" class="status current">${product.price}</span>
      </div>
    `;
      receiptsContainer.appendChild(receiptElement);
    });
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  const vehicles = await getAllVehicles();
  const receipts = await getAllReceipts();
  populateVehicles(vehicles);
  populateReceipts(receipts);
});
