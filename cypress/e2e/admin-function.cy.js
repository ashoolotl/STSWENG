export const adminEmail = "admin@gmail.com"
export const adminPassword = "admin1234"


export function addVehicleClassification(classification) {
   cy.get('#id').click();
   cy.get('#vehicleClassification').type(classification);
   cy.get('#addCarForm button[type="submit"]').wait(3000).click();
}

export function editVehicleClassification(classification, newClassification) {
   cy.get(`[classification="${classification}"] > .car-status > .vehicleClassificationEditBtn`).wait(3500).click();
   cy.get('#vehicleClassificationEdit').clear().type(newClassification);
   cy.get('#editCarForm button[type="submit"]').wait(3000).click();
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
   cy.get('#addSubmit').wait(7500).click();
}

export function editProduct(productName, newProduct) {
   cy.get(`[productname="${productName}"] > .product-details > .productEdit`).wait(3000).click();
   //clear
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
   cy.get('#editSubmit').wait(10000).click();
}

export function addService(service) {
   cy.get('#add > img').click();
   
   //if any data variable is empty -> space
   if (!service || Object.keys(service).length === 0) {
      cy.get('#name').type(" ");
      cy.get('#description').type(" ");
      cy.get('#duration').type(" ");
   } 
   //if not empty -> fill in the data
   if (service.name) cy.get('#name').clear().type(service.name);
   if (service.description) cy.get('#description').clear().type(service.description);
   if (service.duration) cy.get('#duration').clear().type(service.duration.toString());
 
   //vehicle classification + price
   if (service.classification && Array.isArray(service.classification)) {
      service.classification.forEach(item => {
      if (item.type && item.price !== undefined) {
          cy.get(`[data-vehicle-classification="${item.type}"]:visible [type="checkbox"]`).check();
          cy.get(`[data-vehicle-classification="${item.type}"]:visible [type="number"]`).clear().type(item.price.toString());
      }
      });
   }

   cy.get('#form > button').wait(3000).click();
 }
 
 export function editService(serviceName, service, newService) {
   const serviceNameIdentifier = getServiceNameIdentifier(serviceName);
   cy.get(`[servicename="${serviceNameIdentifier}"] > .bottom-item-content > .buttons-container > .serviceEditBtn`).wait(5000).click();
  
   //clear
   cy.get('#nameEdit').clear();
   cy.get('#descriptionEdit').clear();
   cy.get('#durationEdit').clear();
   //clear classification/price of original service details
   if (service.classification && Array.isArray(service.classification)) {
      service.classification.forEach(item => {
        if (item.type) {
          cy.get(`#${item.type}[type="checkbox"]`).uncheck({ force: true });
          cy.get(`#price-${item.type}`).clear();
        }
      });
   }
    
 
   //if any data variable is empty -> space
   if (!newService || Object.keys(newService).length === 0) {
     cy.get('#nameEdit').type(" ");
   } 
   
   else {
     if (newService.name) cy.get('#nameEdit').type(newService.name);
     if (newService.description) cy.get('#descriptionEdit').type(newService.description);
     if (newService.duration) cy.get('#durationEdit').type(newService.duration.toString());
 
     //vehicle classification + price
     if (newService.classification && Array.isArray(newService.classification)) {
       newService.classification.forEach(item => {
         if (item.type) {
            cy.get(`#${item.type}[type="checkbox"]`).check({ force: true });
            cy.get(`#price-${item.type}`).clear().type(item.price.toString());
          }
       });
     }
   }
   cy.get('#formEdit > button').wait(3000).click();
 }
//eg. EXPRESS-WASH for services div tags 
export function getServiceNameIdentifier(serviceName) {
   return serviceName.replace(/\s+/g, '-').toUpperCase();
 }
 