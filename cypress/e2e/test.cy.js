import {siteURL} from './function.cy.js';
import * as func from './function.cy.js';
import * as user from './user-function.cy.js';
import * as admin from './admin-function.cy.js';
//login credentials
import {userEmail, userEmail2, userPassword} from './user-function.cy.js';
import {adminEmail, adminPassword} from './admin-function.cy.js';
//plugin
import 'cypress-real-events/support';

const productData = {
    productName: "Test Product",
    productDescription: "Test Description",
    productPrice: 0,
    productStock: 1
}

describe("Negative Input Test cases", () => {
    beforeEach(() => {
       cy.visit(siteURL + "/login");
       func.login(userEmail, userPassword);
       cy.url().should('include', '/dashboard');
    });
 
    it("Submit Review - Empty text field", () => {
       cy.get('.reviewBtn').click();
       user.createReview(" ");
       cy.contains("One or more fields are empty.").should("be.visible");
    });

    it("Add Product - Invalid Price", () => {
        func.logout();
        cy.visit(siteURL + "/login");
        func.login(adminEmail, adminPassword);
        func.viewPage("product-catalog");
        admin.addProduct(productData);
        cy.wait(2000);
        cy.contains('Price cannot be zero or negative. Please enter a valid price.').should('be.visible');
        cy.get('#addProductPopup').should('be.visible');
        cy.wait(3000);
        cy.reload;
        cy.visit(siteURL + "/product-catalog");
        cy.wait(2000);
        cy.get(`[productname="${productData.productName}"]`).should('not.exist');
    });
 });