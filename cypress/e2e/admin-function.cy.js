export const adminEmail = "admin@gmail.com"
export const adminPassword = "admin1234"


export function addVehicleClassification(classification) {
   cy.get('#id').click();
   cy.get('#vehicleClassification').type(classification);
   cy.get('#addCarForm button[type="submit"]').click();
}

export function editVehicleClassification(classification, newClassification) {
   cy.get(`[classification="${classification}"] > .car-status > .vehicleClassificationEditBtn`).wait(20000).click();
   cy.get('#vehicleClassificationEdit').clear().type(newClassification);
   cy.get('#editCarForm button[type="submit"]').click();
}

export function addProduct(product) {
   cy.get('#addProduct').click();
   //if any data variable is empty -> space
   if (!product || Object.keys(product).length === 0) {
      cy.get(`#editProduct${variable}`).clear().type(" ");
   } 
   else {
       if (product.productName) cy.get('#addProductName').type(product.productName);
       if (product.productDescription) cy.get('#addProductDesc').type(product.productDescription);
       if (product.productPrice) cy.get('#addProductPrice').type(product.productPrice.toString());
       if (product.productStock) cy.get('#addProductAvailability').type(product.productStock.toString());
   }
   cy.get('#addSubmit').click();
}

export function editProduct(productName, newProduct) {
   cy.get(`[productname="${productName}"] > .product-details > .productEdit`).wait(10000).click();
   //clear all fields
   cy.get('#editProductName').clear();
   cy.get('#editProductDesc').clear();
   cy.get('#editProductPrice').clear();
   cy.get('#editProductAvailability').clear();

   //if any data variable is empty -> space
   if (!newProduct || Object.keys(newProduct).length === 0) {
      cy.get('#editProductName').type(" ");
   } 
   else {
       if (newProduct.productName) cy.get('#editProductName').type(newProduct.productName);
       if (newProduct.productDescription) cy.get('#editProductDesc').type(newProduct.productDescription);
       if (newProduct.productPrice) cy.get('#editProductPrice').type(newProduct.productPrice.toString());
       if (newProduct.productStock) cy.get('#editProductAvailability').type(newProduct.productStock.toString());
   }
   cy.get('#editSubmit').click();
}
