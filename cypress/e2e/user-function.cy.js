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
   cy.get('[data-rating="2"]').click();
   cy.get('#reviewText').type(reviewText);
   cy.get('#reviewForm').submit();
}

export function editReview(editText) {
   // cy.get('#userReviewBtn').click();
   // cy.get('#edit-review').click({ force: true });
   cy.get('.review-top > .dropdown').realHover();
   cy.wait(2000)
   cy.get('#edit-review').click();
   cy.get('#reviewEditText').clear();
   cy.get('#reviewEditText').type(editText);
   cy.get('#submitEditReview').click();
}

export function buyService(serviceData) {
   cy.get(`[servicename="${serviceData.name}"] > .bottom-item-content > .buttons-container > .serviceAddToCart`).wait(2000).click();
   cy.get('#bookingPopup').should('be.visible');
   cy.get('#bookingPopup').within(() => {
      cy.get('button[type="submit"]').contains('Add to Cart').click();
   });
   //TODO: Select what vehicle
      cy.on('window:alert', () => {
      return true;
   });
   cy.contains('Item added to cart.').should('be.visible');
}
