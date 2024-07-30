export const adminEmail = "admin@gmail.com"
export const adminPassword = "admin1234"


export function addVehicleClassification(classification) {
   cy.get('#id').click();
   cy.get('#vehicleClassification').type(classification);
   cy.get('#addCarForm button[type="submit"]').click();
}

export function editVehicleClassification(classification, newClassification) {
   cy.get(`.vehicleClassificationEditBtn`).click();
   cy.get('#vehicleClassificationEdit').clear().type(newClassification);
   cy.get('#editCarForm button[type="submit"]').click();
}