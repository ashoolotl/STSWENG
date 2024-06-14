const getUserInformation = async (id) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `/api/v1/users/${id}`,
        });

        return res.data;
    } catch (err) {
        alert(err.response.data.message);
    }
};
document.addEventListener('DOMContentLoaded', function () {
    // This function will be executed when the DOM is fully loaded
    // Put your JavaScript code here
    // Example:
    // Your other JavaScript code here...
});

function closeMoreInfoPopup() {
    document.getElementById('showMoreInfoPopupSubscription').style.display =
        'none';
}
