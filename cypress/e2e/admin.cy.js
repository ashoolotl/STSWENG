import * as func from './function.cy.js';
import * as user from './user-function.cy.js';
import * as admin from './admin-function.cy.js';
//variables
import {adminEmail, adminPassword} from './admin-function.cy.js';
import {userEmail, userPassword} from './user-function.cy.js';
import {siteURL} from './function.cy.js';
//plugin
import 'cypress-real-events/support';

describe("Login Validation", () => {

   beforeEach(() => {
      cy.visit(siteURL + "/login");
   });

   it("Valid Login", () => {
      func.login(adminEmail, adminPassword);
      cy.url().should('eq', siteURL + "/dashboard");
      cy.contains('Admin').should('be.visible');
   });

   it("Logout", () => {
      func.login(adminEmail, adminPassword);
      func.logout();
      cy.contains('logged out').should('be.visible');
   });
});

const testClassification = "SUV"
const newClassification = "Motorcycle"

describe("Manage Vehicle Classifications", () => {
   beforeEach(() => {
      cy.visit(siteURL + "/login");
      func.login(adminEmail, adminPassword);
      cy.url().should('eq', siteURL + "/dashboard");
      func.selectDropdown('Manage Vehicle Classifications');
   });

   it.skip("Add Vehicle Classification", () => {
      admin.addVehicleClassification(testClassification);
      cy.contains('Vehicle Classification has been added').should('be.visible');
      cy.url().should('eq', siteURL + "/vehicle-classifications");
      cy.get(`[classification="${testClassification}"]`).should('be.visible');
   });

   it.skip("Edit Vehicle Classification", () => {
      admin.editVehicleClassification(testClassification, newClassification);
      cy.contains('updated successfully').should('be.visible');
      cy.url().should('eq', siteURL + "/vehicle-classifications");
      cy.get(`[classification="${newClassification}"]`).should('be.visible');
   }); 

   it.skip("Delete Vehicle Classification", () => {
      // cy.get(`[classification="${newClassification}"]`).find('#vehicleClassificationDeleteBtn').click();
      // cy.get(`[classification="SUV"]`).find('vehicleClassificationDeleteBtn').click();
      cy.get('.car[classification="SUV"]').within(() => {
         cy.contains('button', 'Delete').click();
       });
       
      cy.contains('deleted successfully').should('be.visible');
      cy.get(`[classification="SUV"]`).should('not.exist');
   });
   it("Test Button Click", () => {
      cy.contains('Services').click();
      cy.get('[servicename="EXPRESS"] > .bottom-item-content > .buttons-container > a > .adminReviewBtn').click();
      func.logout();
      cy.visit(siteURL + "/login");
      func.login(userEmail, userPassword);
      cy.contains('Services').click();
      cy.get('[servicename="EXPRESS"] > .bottom-item-content > .buttons-container > a > .review-btn').click();


   });

});
// describe("Reviews", () => {
//    before(() => {
//       cy.visit(siteURL + "/login");
//       func.login(userEmail, userPassword);
//       user.createReview("This is a test review for Admin");
//       func.logout();
//    });


//    it("Reply to Review", () => {
//       cy.visit(siteURL + "/login");
//       func.login(adminEmail, adminPassword);
//       func.viewPage('services');
//       cy.get(':nth-child(1) > .bottom-item-content > .buttons-container > a > #adminReviewBtn').click();
//       cy.get('.reply-button').click();
//       cy.get('#reply-text').type("This is a reply to the review");
//       cy.get('#admin-input').find('button[type="submit"]').click();
//       cy.contains('reply has been successfully posted').should('be.visible');
//       cy.contains('This is a reply to the review').should('be.visible');
//    });


//    after(() => {
//       cy.visit(siteURL + "/login");
//       func.login(userEmail, userPassword);
//       func.viewPage('services');
//       cy.get('#userReviewBtn').click();
//       cy.get('#delete-review').click({ force: true });
//       cy.contains("successfully deleted").should('be.visible');
//    });
// });


const productData = [
   //Valid [0]
   {
      productName: "Turtle Wax Car Wash 64oz", 
      productDescription: "The high-foaming formula surrounds dirt and road grime and lifts them off the surface of your clear coat for scratch-free cleaning.",
      productPrice: 799,
      productStock: 29,
   },
   //Duplicate Name [1]
   {
      productName: "Turtle Wax Car Wash 64oz", 
      productDescription: "The high-foaming formula surrounds dirt and road grime and lifts them off the surface of your clear coat for scratch-free cleaning.",
      productPrice: 799,
      productStock: 29,
   },
   //Empty Values [2]
   {
      productName: "", 
      productDescription: "",
      productPrice: 799,
      productStock: 29,
   },
   //Invalid Price [3]
   {
      productName: "Turtle Wax Car Wash 32oz", 
      productDescription: "The high-foaming formula surrounds dirt and road grime and lifts them off the surface of your clear coat for scratch-free cleaning.",
      productPrice: 0,
      productStock: 29,
   },
   //Invalid Stock [4]
   {
      productName: "Turtle Wax Car Wash 32oz", 
      productDescription: "The high-foaming formula surrounds dirt and road grime and lifts them off the surface of your clear coat for scratch-free cleaning.",
      productPrice: 799,
      productStock: 0,
   },
   
];
// describe("Manage Product Catalog", () => {
//    beforeEach(() => {
//       cy.visit(siteURL + "/login");
//       func.login(adminEmail, adminPassword);
//       func.viewPage('product-catalog');
//    });


//    it("Add Product", () => {
//       cy.get("#addProduct").click();
//       cy.get('[productname="Midwest Gasoline Can 5-Gallon"] > .product-details > .productEdit')


//    });
//    it("Edit Product", () => {
//       cy.get("#productEdit").click();
//    });

   
// });

