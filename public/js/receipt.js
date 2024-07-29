document.addEventListener("DOMContentLoaded", function () {
  // Select all elements with the class 'product-price'
  const productPrices = document.querySelectorAll(".product-price");

  // Check if there are any product prices to calculate
  if (productPrices.length > 0) {
    let totalPrice = 0;

    // Loop through each price and add it to the total
    productPrices.forEach(function (priceElement) {
      // Get the text content, remove the Euro symbol, and convert to a number
      const priceText = priceElement.textContent.trim().replace("€", "");
      const price = parseFloat(priceText);

      // Add the price to the total price
      totalPrice += price;
    });

    // Update the total price element
    const totalPriceElement = document.querySelector(".total-price");
    totalPriceElement.textContent = `€${totalPrice.toFixed(2)}`;
  }
});
