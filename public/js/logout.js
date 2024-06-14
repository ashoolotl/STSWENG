const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout',
        });
        if (res.data.status == 'success') {
            alert('You will now be logged out');
            location.replace('/');
        }
    } catch (err) {
        alert(err.data.message);
    }
};
