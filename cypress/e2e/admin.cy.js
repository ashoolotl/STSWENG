import * as func from './function.cy.js';
import * as user from './user-function.cy.js';
import * as admin from './admin-function.cy.js';
//variables
import {adminEmail, adminPassword} from './admin-function.cy.js';
import {userEmail, userPassword} from './user-function.cy.js';
import {siteURL} from './function.cy.js';

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


describe("Reviews", () => {
   before(() => {
      cy.visit(siteURL + "/login");
      func.login(userEmail, userPassword);
      user.createReview("This is a test review for Admin");
      func.logout();
   });


   it("Reply to Review", () => {
      cy.visit(siteURL + "/login");
      func.login(adminEmail, adminPassword);
      cy.get('.navbar-left > [href="/services"]').click();
      cy.get(':nth-child(1) > .bottom-item-content > .buttons-container > a > #adminReviewBtn').click();
      cy.get('.reply-button').click();
      cy.get('#reply-text').type("This is a reply to the review");
      cy.get('#admin-input').find('button[type="submit"]').click();
      cy.contains('reply has been successfully posted').should('be.visible');
      cy.contains('This is a reply to the review').should('be.visible');
   });


   after(() => {
      cy.visit(siteURL + "/login");
      func.login(userEmail, userPassword);
      cy.get('[href="/services"]').click();
      cy.get('#userReviewBtn').click();
      cy.get('#delete-review').click({ force: true });
      cy.contains("successfully deleted").should('be.visible');
   });
});

