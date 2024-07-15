const logout = async () => {
  try {
    const response = await fetch("/api/v1/users/logout", {
      method: "GET",
    });
    const res = await response.json();
    if (res.status == "success") {
      /* document.getElementById("closePopupSuccess").innerText = "X"; */
      document.getElementById("successPopup").style.display = "block";
      document.getElementById("successText").innerText = "You will now be logged out.";
      window.setTimeout(() => {
        location.replace("/");
      }, 1000);
    }
  } catch (err) {
    console.error(err.message);
    document.getElementById("errorPopup").style.display = "block";
    document.getElementById("errorText").innerText = "An error occurred while logging out. Please try again later.";
  }
};
