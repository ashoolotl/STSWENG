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
      cy.wait(20000)
      cy.reload();
      cy.get(`[classification="${newClassification}"]`).should('be.visible');
   }); 

   it.skip("Delete Vehicle Classification", () => {
      cy.get(`[classification="${testClassification}"] > .car-status > .vehicleClassificationDeleteBtn`).wait(10000).click();
      cy.contains('deleted successfully').should('be.visible');
      cy.get(`[classification="SUV"]`).should('not.exist');
   });
 

});

// describe("Reviews", () => {
//    before(() => {
//       cy.visit(siteURL + "/login");
//       func.login(userEmail, userPassword);
//       user.createReview("This is a test review for Admin");
//       func.logout();
//    });


//    it.skip("Reply to Review", () => {
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
      productName: "Autogard Tire Black 500ml", 
      productDescription: "The high-foaming formula surrounds dirt and road grime and lifts them off the surface of your clear coat for scratch-free cleaning.",
      productPrice: 799,
      productStock: 29,
   },
   //Duplicate Name [1]
   {
      productName: "Auto Foam Wash 500ml", 
      productDescription: "The high-foaming formula surrounds dirt and road grime and lifts them off the surface of your clear coat for scratch-free cleaning.",
      productPrice: 799,
      productStock: 29,
   },
   //Empty Values [2]
   {
      productName: "", 
      productDescription: "",
      productPrice: 899,
      productStock: 32,
   },
   //Invalid Price [3]
   {
      productName: "Invalid Price Product", 
      productDescription: "The high-foaming formula surrounds dirt and road grime and lifts them off the surface of your clear coat for scratch-free cleaning.",
      productPrice: 0,
      productStock: 29,
   }, 
   //Valid Edit [4]
   {
      productName: "Autogard Tire Black 250ml", 
      productDescription: "The high-foaming formula surrounds dirt and road grime.",
      productPrice: 499,
      productStock: 27,
   }
];
describe("Manage Product Catalog", () => {
   beforeEach(() => {
      cy.visit(siteURL + "/login");
      func.login(adminEmail, adminPassword);
      func.viewPage('product-catalog');
   });


   it("Add Valid Product", () => {
      admin.addProduct(productData[0]);
      cy.contains('Product successfully added.').should('be.visible');
      cy.get(`[productname="${productData[0].productName}"]`).should('be.visible');
   });

   //TODO Add Invalid Products

   it("Duplicate Name Edit", () => {  
      admin.editProduct(productData[0].productName, productData[1]);
      cy.contains('Product name already exists. Please choose a different name.').should('be.visible');
      cy.reload();
      cy.visit(siteURL + "/product-catalog");
      cy.get(`[productname="${productData[0].productName}"]`).should('be.visible'); //product remains unchanged
   });
   
   it("Empty Values Edit", () => {
      admin.editProduct(productData[0].productName, productData[2]);
      cy.contains('One or more fields is empty. Please fill in all fields.').should('be.visible');
      cy.reload();
      cy.visit(siteURL + "/product-catalog");
      cy.get(`[productname="${productData[0].productName}"]`).should('be.visible'); //product remains unchanged
   });

   it("Invalid Price Edit", () => {
      admin.editProduct(productData[0].productName, productData[3]);
      cy.contains('Price cannot be zero or negative. Please enter a valid price.').should('be.visible');
      cy.reload();
      cy.visit(siteURL + "/product-catalog");
      cy.get(`[productname="${productData[0].productName}"]`).should('be.visible'); //product remains unchanged
   });
   it("Valid Edit Product", () => {
      admin.editProduct(productData[0].productName, productData[4]);
      cy.contains('Product updated.').should('be.visible');
      cy.get(`[productname="${productData[0].productName}"]`).should('be.visible');
   });

   
   
   after (() => {
      cy.request('DELETE', "api/v1/deleteProduct/" + productData[0].productName)
      cy.request('DELETE', "api/v1/deleteProduct/" + productData[4].productName)
   });
   
});

