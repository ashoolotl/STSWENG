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
      productName: "WD-40 Multi-use Product 11.2oz.", 
      productDescription: "INVALID PRODUCT",
      productPrice: 199,
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
      cy.wait(5000)
   });


   it("Add Valid Product", () => {
      admin.addProduct(productData[0]);
      cy.contains('Product successfully added.').should('be.visible');
      cy.get(`[productname="${productData[0].productName}"]`).should('be.visible');
   });

   it("Add Product - Duplicate Name", () => {
      admin.addProduct(productData[1]);
      cy.wait(4000)
      cy.contains('Product name already exists. ').should('be.visible');
      cy.get('#addProductPopup').should('be.visible');
      cy.wait(3000)
      cy.reload
      cy.visit(siteURL + "/product-catalog");
      cy.wait(1000)
      cy.get(`[productname="${productData[1].productName}"]`).should('have.length', 1);
   });

   it("Add Product - Empty Values", () => {
      admin.addProduct(productData[2]);
      cy.wait(3000)
      cy.contains('One or more fields is empty. Please fill in all fields.').should('be.visible');
      cy.get('#addProductPopup').should('be.visible');
   });
   

   it("Duplicate Name Edit", () => {  
      admin.editProduct(productData[0].productName, productData[1]);
      cy.wait(3000)
      cy.contains('Product name already exists. Please choose a different name.').should('be.visible');
      cy.wait(3000)
      cy.reload();
      cy.visit(siteURL + "/product-catalog");
      cy.wait(3000)
      cy.get(`[productname="${productData[0].productName}"]`).should('be.visible'); //product remains unchanged
   });
   
   it("Empty Values Edit", () => {
      admin.editProduct(productData[0].productName, productData[2]);
      cy.contains('One or more fields is empty. Please fill in all fields.').should('be.visible');
      cy.wait(3000)
      cy.reload();
      cy.visit(siteURL + "/product-catalog");
      cy.wait(3000)
      cy.get(`[productname="${productData[0].productName}"]`).should('be.visible'); //product remains unchanged
   });

   it("Invalid Price Edit", () => {
      admin.editProduct(productData[0].productName, productData[3]);
      cy.contains('Price cannot be zero or negative. Please enter a valid price.').should('be.visible');
      cy.wait(3000)
      cy.reload();
      cy.visit(siteURL + "/product-catalog");
      cy.wait(3000)
      cy.get(`[productname="${productData[0].productName}"]`).should('be.visible'); //product remains unchanged
   });
   it("Valid Edit Product", () => {
      admin.editProduct(productData[0].productName, productData[4]);
      cy.contains('Product updated.').should('be.visible');
      cy.wait(3000)
      cy.reload();
      cy.visit(siteURL + "/product-catalog");
      cy.wait(3000)
      cy.get(`[productname="${productData[4].productName}"]`).should('be.visible');
      cy.get(`[productname="${productData[0].productName}"]`).should('not.exist');
   });

   after (() => {
      cy.request('DELETE', "api/v1/deleteProduct/" + productData[0].productName)
      cy.request('DELETE', "api/v1/deleteProduct/" + productData[4].productName)
   });
   
});

const testClassification = "SUV"
const newClassification = "VAN"

describe("Manage Vehicle Classifications", () => {
   beforeEach(() => {
      cy.visit(siteURL + "/login");
      func.login(adminEmail, adminPassword);
      cy.url().should('eq', siteURL + "/dashboard");
      func.selectDropdown('Manage Vehicle Classifications');
   });

   it("Add Vehicle Classification", () => {
      admin.addVehicleClassification(testClassification);
      cy.contains('Vehicle Classification has been added').should('be.visible');
      cy.url().should('eq', siteURL + "/vehicle-classifications");
      cy.get(`[classification="${testClassification}"]`).should('be.visible');
   });

   it("Edit Vehicle Classification", () => {
      admin.editVehicleClassification(testClassification, newClassification);
      cy.contains('updated successfully').should('be.visible');
      cy.url().should('eq', siteURL + "/vehicle-classifications");
      cy.wait(4500)
      cy.reload()
      cy.get(`[classification="${newClassification}"]`).should('be.visible');
   }); 

   it("Delete Vehicle Classification", () => {
      cy.get(`[classification="${newClassification}"] > .car-status > .vehicleClassificationDeleteBtn`).wait(5000).click();
      cy.contains('deleted successfully').should('be.visible');
      cy.get(`[classification="${newClassification}"]`).should('not.exist');
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


const serviceData = [
  // Valid Case [0]
  {
    name: "Quick Wash",
    description: "Complete car wash and detailing",
    duration: 120,
    classification: [
      { type: "SEDAN", price: 50 },
      { type: "COUPE", price: 70 }
    ]
  },
  // Empty Field/s [1]
  {
    name: "",
    description: "Complete car wash and detailing",
    duration: 120,
    classification: [
      { type: "SEDAN", price: 50 },
      { type: "COUPE", price: 70 }
    ]
  },
  // Invalid Duration [2]
  {
    name: "Invalid Duration Service",
    description: "Basic car wash",
    duration: 0,
    classification: [
      { type: "SEDAN", price: 20 }
    ]
  },
  // No Vehicle Classification/Price [3]
  {
    name: "Interior Cleaning",
    description: "Detailed interior cleaning",
    duration: 60,
    classification: []
  },
  // Invalid Price [4]
  {
    name: "Engine Cleaning",
    description: "Engine bay cleaning",
    duration: 30,
    classification: [
      { type: "SEDAN", price: 0 }
    ]
  },
  // Duplicate Name [5]
  {
    name: "Express Wash",
    description: "Complete car wash and detailing",
    duration: 120,
    classification: [
      { type: "SEDAN", price: 50 },
    ]
  },
   // Valid Edit [6]
   {
      name: "Hyper Wash",
      description: "Complete car wash and detailing",
      duration: 120,
      classification: [
        { type: "SEDAN", price: 50 },

      ]
    }
];
describe("Manage Services", () => {
   beforeEach(() => {
      cy.visit(siteURL + "/login");
      func.login(adminEmail, adminPassword);
      cy.url().should('eq', siteURL + "/dashboard");
      func.selectDropdown('Manage Services');
   }); 

   it("Add Valid Service", () => {
      cy.url().should('eq', siteURL + "/services");
      admin.addService(serviceData[0]);
      const serviceNameIdentifier = admin.getServiceNameIdentifier(serviceData[0].name);
      cy.get(`[servicename="${serviceNameIdentifier}"] > img`).should('be.visible');
    });

   it("Add Service - Empty Field/s", () => {
      admin.addService(serviceData[1]);
      cy.contains('One or more fields is empty. Please fill in all fields and try again').should('be.visible');
      cy.get('#addServicePopup').should('be.visible');
    });

   it("Add Service - No Vehicle Classification/Price", () => {
      admin.addService(serviceData[3]);
      cy.contains('Please select at least one vehicle classification. Please try again.').should('be.visible');
      cy.get('#addServicePopup').should('be.visible');
    });

   it("Add Service - Duplicate Name", () => {
      admin.addService(serviceData[5]);
      cy.wait(3000)
      cy.contains('Service already exists').should('be.visible');
      cy.get('#addServicePopup').should('be.visible');
    });

   it("Edit Service - Empty Field/s", () => {

   const serviceNameIdentifier = admin.getServiceNameIdentifier(serviceData[0].name);
      admin.editService(serviceNameIdentifier, serviceData[0], serviceData[1]);
      cy.wait(3000)
      cy.contains('One or more fields is empty. Please fill in all fields and try again').should('be.visible');
      cy.wait(3000)
      cy.get('#editServicePopup').should('be.visible');
   });

   it("Edit Service - No Vehicle Classification/Price", () => {
      const serviceNameIdentifier = admin.getServiceNameIdentifier(serviceData[0].name);
      admin.editService(serviceNameIdentifier, serviceData[0], serviceData[3]);
      cy.contains('Please select at least one vehicle classification. Please try again.').should('be.visible');
      cy.get('#editServicePopup').should('be.visible');
   });

   it("Edit Service - Duplicate Name", () => {
      const serviceNameIdentifier = admin.getServiceNameIdentifier(serviceData[0].name);
      admin.editService(serviceNameIdentifier, serviceData[0], serviceData[5]);
      cy.wait(3000)
      cy.contains('Service already exists').should('be.visible');
      cy.get('#editServicePopup').should('be.visible');
   });

    it("Valid Service Edit", () => {
      const serviceNameIdentifier = admin.getServiceNameIdentifier(serviceData[0].name);
      const newServiceNameIdentifier = admin.getServiceNameIdentifier(serviceData[6].name);
      admin.editService(serviceNameIdentifier, serviceData[0], serviceData[6]);
      cy.contains('The service has been successfully updated.').should('be.visible');
      cy.get(`[servicename="${newServiceNameIdentifier}"] > img`).should('be.visible');
    });

    it("Delete Service", () => {
      const serviceNameIdentifier = admin.getServiceNameIdentifier(serviceData[6].name);
      cy.get(`[servicename="${serviceNameIdentifier}"] > .bottom-item-content > .buttons-container > .serviceDeleteBtn`).wait(4000).click();
      cy.contains('The service has been deleted successfully.').should('be.visible');
      cy.get(`[servicename="${serviceNameIdentifier}"]`).should('not.exist');
    });
    
});

describe("Manage Bookings", () => {


});


