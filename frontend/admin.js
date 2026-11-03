
const searchInput = document.getElementById("searchBooking");

searchInput.addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();
    const rows = document.querySelectorAll("#bookingTable tr");

    rows.forEach(function (row) {
        const customerName = row.cells[0].textContent.toLowerCase();

        row.style.display = customerName.includes(searchValue)
            ? ""
            : "none";
    });
});
