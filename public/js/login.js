document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  login(email, password);
});

const login = async (email, password) => {
  try {
    const response = await fetch("/api/v1/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "An error occurred during login.");
    }
    console.log("Response:", data);
    window.location.assign("/dashboard");
  } catch (error) {
    const errorMessage = error.message || "An unexpected error occurred.";
    console.error("Error:", errorMessage);
  }
};
