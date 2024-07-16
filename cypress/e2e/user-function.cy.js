//User ONLY test functions/variables 

export const userEmail = "test@gmail.com";
export const userEmail2 = "viewer@gmail.com";
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
   cy.get('#classType').select(vehicle.classType);
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
export function createReview(reviewText) {
   cy.get('#reviewBtn').click();
   cy.get('[data-rating="2"]').click();
   cy.get('#reviewText').type(reviewText);
   cy.get('#reviewForm').submit();
}

//TODO: Function to login on different account to see created/edited reviews

// cy.get(':nth-child(3) > .car-status > :nth-child(1)').should('contain', 'See Review');
      // cy.get('#reviewBtn').click();
      // cy.url().should('include', '/reviews');