//User ONLY test functions/variables 

export const userEmail = "test@gmail.com";
export const userPassword = "test1234";


export function registerUser(user) {
   cy.url().should('include', '/register'); 
   //input fields
   cy.get('input[name=fname]').type(user.firstName);
   cy.get('input[name=lname]').type(user.lastName);
   cy.get('input[name=email]').type(user.email);
   cy.get('input[name=password]').type(user.password);
   cy.get('input[name=passwordConfirm]').type(user.confirmPassword);
   cy.get('select[name=cars]').select('1to3'); //Auto select first dropdown option
   cy.get('button[type="submit"]').contains('Register').click();
 }
export function registerVehicle(vehicle) {
   cy.get('#addPhoto').click();
   cy.get('select[name="classType"]').select(vehicle.classType);
   cy.get('#carBrand').type(vehicle.carBrand);
   cy.get('#plateNumber').type(vehicle.plateNumber);
   cy.get('button[type="submit"]').contains("Submit").click();
   //TODO: Update when alerts/confirm messages are replaced
   cy.on('window:confirm', (text) => {
      if (text.includes('Do you still want to proceed to add this to your vehicle?')) {
         return true; //confirm
      }
   });
}