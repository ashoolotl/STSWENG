const logout = async () => {
  try {
    const response = await fetch("/api/v1/users/logout", {
      method: "GET",
    });
    const res = await response.json();
    if (res.status == "success") {
      alert("You will now be logged out");
      location.replace("/");
    }
  } catch (err) {
    alert("Error logging out");
  }
};
