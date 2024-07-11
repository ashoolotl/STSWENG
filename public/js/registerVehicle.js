const addVehicle = async (data) => {
  try {
    const response = await fetch("/api/v1/vehicles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const resData = await response.json();
    if (resData.status == "success") {
      document.getElementById("successPopup").style.display = "block";
      document.getElementById("successText").innerText = "Your car has been added successfully.";
      window.setTimeout(() => {
        location.assign("/dashboard");
      }, 1500);
    } else {
      throw new Error(`${resData.message || "An error occurred while adding vehicle."}`);
    }
  } catch (err) {
    if (err.message.includes('E11000 duplicate key error')) {
      console.error("Plate Number already exists in database. Duplicate key error.")
      document.getElementById("addcar-error-message").innerText = "Vehicle plate number already exists.";
    } else {
      console.error(err);
      document.getElementById("errorPopup").style.display = "block";
      document.getElementById("errorText").innerText = "An error occurred while adding vehicle classifications. Please try again later.";
    }  
  }
};

document.getElementById("add").addEventListener("click", function () {
  document.getElementById("addCarPopup").style.display = "block";
}); // opening of add car popup

document.getElementById("closePopup").addEventListener("click", function () {
  document.getElementById("addCarPopup").style.display = "none";
}); // closing of add car popup through x button

document.getElementById("addCarForm").addEventListener("submit", function (event) {
  event.preventDefault();
  
  const classType = document.querySelector('#classType').value;
  const carBrand = document.getElementById("carBrand").value;
  const plateNumber = document.getElementById("plateNumber").value;
  const plateNumberRegex = /^\d{3}[A-Z]{3}\d{4}$/; 
  
  if (plateNumber.trim() === "" || carBrand.trim() === "" || classType.trim() === "") {
    console.error("Car brand or plate number is empty.");
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "One or more fields are empty. Please fill in all fields.";
  }
  else if (!plateNumberRegex.test(plateNumber)) {
    console.error("Invalid plate number.");
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "Plate number must be in the format 3Digits3Letters4Digits. \n\nExample: 123ABC4567. Please try again.";
  } else {
    const vehicleData = {
      classification: document.getElementById("classType").value,
      brand: document.getElementById("carBrand").value,
      plateNumber: document.getElementById("plateNumber").value,
      owner: document.getElementById("userId").value,
    };
    // document.getElementById("confirmPopup").style.display = "block";
    // add popup to confirm the details of the vehicle
    var confirmResult = confirm(
      "Do you agree that the vehicle details are correct and owned by you. Do you still want to proceed to add this to your vehicle?"
    );
    if (confirmResult) {
      addVehicle(vehicleData);
    } else {
      console.log("");
    }
  }
}); 

document.getElementById("closePopupSuccess").addEventListener("click", function () {
  document.getElementById("successPopup").style.display = "none";
}); // closing of success popup through x button

document.getElementById("closePopupConfirm").addEventListener("click", function () {
  document.getElementById("confirmPopup").style.display = "none";
}); // closing of confirm popup through x button