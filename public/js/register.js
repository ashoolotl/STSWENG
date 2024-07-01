const register = async (firstName, lastName, email, password, passwordConfirm, numberOfCarsOwned) => {
  try {
    const response = await fetch("/api/v1/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        passwordConfirm,
        numberOfCarsOwned,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "An error occurred during registration.");
    }
    console.log("Response:", data);
    document.getElementById("successPopup").style.display = "block";
    document.getElementById("successText").innerText = "Registered Successfully. Redirecting to dashboard..";
    window.setTimeout(() => {
      location.assign("/dashboard");
    }, 1000);
  } catch (error) {
    const errorMessage = error.message || "An unexpected error occurred.";
    console.error("Error:", errorMessage);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "An error occurred while registering. Please try again later.";
  }
};

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const firstName = document.querySelector('input[name="fname"]').value;
  const lastName = document.querySelector('input[name="lname"]').value;
  const email = document.querySelector('input[name="email"]').value;
  const password = document.querySelector('input[name="password"]').value;
  const passwordConfirm = document.querySelector('input[name="passwordConfirm"]').value;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const numberOfCarsOwned = document.querySelector('select[name="cars"]').value;

  if (firstName.trim() === "" || 
      lastName.trim() === "" || 
      email.trim() === "" || 
      password.trim() === "" || 
      passwordConfirm.trim() === "" || 
      numberOfCarsOwned.trim() === "") {
    console.error("One or more fields are empty.");
    document.getElementById("error-message").innerText = "One or more fields is empty. Please fill in all fields.";
    document.getElementById("error-message").style.backgroundColor = "red";
  } else if (!emailRegex.test(email)) {
    console.error("Email is invalid.");
    document.getElementById("error-message").innerText = "Email is invalid. Please enter a valid email address.";
    document.getElementById("error-message").style.backgroundColor = "red";
  } else if (password.length < 8) {
    console.error("Password is too short.");
    document.getElementById("error-message").innerText = "Password is too short. Please enter a password with at least 8 characters.";
    document.getElementById("error-message").style.backgroundColor = "red";
  } else if (password !== passwordConfirm){
    console.error("Password and Confirm Password do not match.");
    document.getElementById("error-message").innerText = "Password and Confirm Password do not match. Please enter the same password in both fields.";
    document.getElementById("error-message").style.backgroundColor = "red";
  } else {
    // You can now use these values as needed
    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Password Confirm:", passwordConfirm);

    console.log("Number of cars owned:", numberOfCarsOwned);

    register(firstName, lastName, email, password, passwordConfirm, numberOfCarsOwned);
  }
});

function onlyAlphabets(evt) {
  var charCode = evt.which ? evt.which : event.keyCode;
  if ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122) && charCode != 32) {
    evt.preventDefault();
    return false;
  }
  return true;
}
