import {siteURL} from './function.cy.js';
import * as func from './function.cy.js';
import * as user from './user-function.cy.js';
import * as admin from './admin-function.cy.js';
//login credentials
import {userEmail, userEmail2, userPassword} from './user-function.cy.js';
import {adminEmail, adminPassword} from './admin-function.cy.js';
//plugin
import 'cypress-real-events/support';
import 'cypress-plugin-stripe-elements';


const serviceData = {
   name: "EXPRESS-WASH",
   plateNumber:  "123ABC0182",
   // plateNumber: "123ABC9999"
   classification: "COUPE",
   caseName: "Express Wash"
}

describe("Service Checkout + Review", () => {

   beforeEach(() => {
      cy.visit(siteURL + "/login");
   });

   //USER Actions -> Buy Service
   // it("Add Service to Cart", () => {
   //    func.login(userEmail, userPassword);
   //    func.viewPage("services");
   //    cy.url().should('include', '/services');
   //    user.buyService(serviceData);
   // });

   // it("View Cart Contents", () => {
   //  func.login(userEmail, userPassword);
   //  cy.get('.cart-icon > img').click();
   //  cy.get('#servicesCartTab').click();
   //  //verify correct service was added 
   //  cy.get('.item-details').should('have.length', 1).within(() => {
   //    cy.get('h1').should('have.text', serviceData.name);
   //    cy.get('input[type="text"]').should('have.value', serviceData.plateNumber);zz
   //  });

   // });

   // it("Checkout Service + Receipt", () => {
   //    func.login(userEmail, userPassword);
   //    cy.get('.cart-icon > img').click();
   //    cy.get('#servicesCartTab').click();
   //    //simulate purchase
   //    cy.visit( siteURL + '/carts?payment=success');
   //    cy.contains("Payment successful. Thank you for your purchase!").should('be.visible');
   //    cy.wait(5000)
   //    cy.url().should('include', '/receipt');
   //    //check receipt 
   //    cy.contains(serviceData.name.replace(/-/g, ' ')).should('be.visible');
   // });


   //ADMIN Actions -> Mark service as completed
   it.skip("Admin Login", () => {
      func.login(adminEmail, adminPassword);
      func.selectDropdown("Manage Bookings")
      cy.get(`[data-cardetails="${serviceData.classification}-${serviceData.plateNumber}"] > .car-status > .car-info`)
         .should('contain', 'Pending: '+ serviceData.caseName.toUpperCase());
      //mark service as completed
      cy.get(`[data-cardetails="${serviceData.classification}-${serviceData.plateNumber}"] > .car-status > .car-info > .update-status`).click();
      cy.get(`[data-cardetails="${serviceData.classification}-${serviceData.plateNumber}"] > .car-status > .car-info`)
         .should('contain', 'To Review');
   });

   //USER Actions -> Review Service
   const reviewText = "This is a review for testing purposes.";
   const editText = "This is an edited review for testing purposes.";
   const adminText = "This is a reply from the admin for testing purposes.";
   it("User Review", () => {
      func.login(userEmail, userPassword);
      cy.get(`[cardetails="${serviceData.classification}-${serviceData.plateNumber}"]`).within(() => {
         cy.get('.reviewBtn').click();
       });
      cy.wait(5000)
      cy.get('#reviewPopup').should('be.visible');
      user.createReview(reviewText);
      cy.contains("successfully posted").should('be.visible');
      cy.wait(5000)
      cy.url().should('include', '/reviews');
      cy.contains(reviewText).should('be.visible');
   });

   it("Edit Review", () => {
      func.login(userEmail, userPassword);
      func.viewPage("services");
      cy.get(`[servicename="${serviceData.name}"] > .bottom-item-content > .buttons-container > a > .review-btn`).wait(2000).click();
      user.editReview(editText);
      cy.contains("successfully updated").should('be.visible');
      cy.wait(5000)
      cy.url().should('include', '/reviews');
      cy.contains(editText).should('be.visible');
   });

   //ADMIN Actions -> Reply to Review
   it("Admin Reply", () => {
      func.login(adminEmail, adminPassword);
      cy.visit(siteURL + "/services");
      cy.get(`[servicename="${serviceData.name}"] > .bottom-item-content > .buttons-container > a > .review-btn`).wait(2000).click();
      cy.get('.reply-button').click();
      cy.get('#reply-text').type(adminText);
      cy.get('#admin-input').find('button[type="submit"]').click();
      cy.contains('reply has been successfully posted').should('be.visible');
      cy.contains('This is a reply to the review').should('be.visible');
   });


    //if review is visible to other users
    it("View Other's Reviews", () => { 
      func.login(userEmail2, userPassword);
      func.viewPage("services");
      cy.get(`[servicename="${serviceData.name}"] > .bottom-item-content > .buttons-container > a > .review-btn`).wait(2000).click();
      cy.contains(editText).should('be.visible');
      cy.contains(adminText).should('be.visible');
      cy.get('.review-top > .dropdown > .dropbtn').should('not.exist');
   });

   //USER Actions -> Delete Review
   it("Delete Review", () => {
      func.login(userEmail, userPassword);
      func.viewPage("services");
      cy.get(`[servicename="${serviceData.name}"] > .bottom-item-content > .buttons-container > a > .review-btn`).wait(2000).click();
      cy.get('.review-top > .dropdown').realHover();
      cy.wait(2000)
      cy.get('#delete-review').click();
      cy.contains('successfully deleted').should('be.visible');
      cy.contains(editText).should('not.exist');
   });

});

