function showEditPopup() {
    closePopups();
    document.getElementById("editPopup").style.display = "block";
}

function showEditConfirmPopup() {
    closePopups();
    document.getElementById("successEditPopup").style.display = "block";
}

function showDeletePopup() {
    closePopups();
    document.getElementById("deletePopup").style.display = "block";
}

function showDeleteConfirmPopup() {
    closePopups();
    document.getElementById("successDeletePopup").style.display = "block";
}

function closeEditPopup() {
    document.getElementById("editPopup").style.display = "none";
}

function closeEditConfirmPopup() {
    document.getElementById("successEditPopup").style.display = "none";
}

function closeDeletePopup() {
    document.getElementById("deletePopup").style.display = "none";
}

function closeDeleteConfirmPopup() {
    document.getElementById("successDeletePopup").style.display = "none";
}

function closePopups() {
    closeEditPopup();
    closeDeletePopup();
    closeDeleteConfirmPopup();
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".edit-form");
    const confirmBtn = document.querySelector(".confirm-edit-btn");

    form.addEventListener("input", function () {
        const inputs = form.querySelectorAll("input[required]");
        const textarea = form.querySelector("textarea[required]");

        let allFilled = true;

        inputs.forEach(function (input) {
            if (input.value.trim() === "") {
                allFilled = false;
            }
        });

        if (textarea.value.trim() === "") {
            allFilled = false;
        }

        if (allFilled) {
            confirmBtn.removeAttribute("disabled");
        } else {
            confirmBtn.setAttribute("disabled", "disabled");
        }
    });
});