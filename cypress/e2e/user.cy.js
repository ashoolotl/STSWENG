import * as func from './function.cy.js';
import * as user from './user-function.cy.js';
//variables
import {userEmail, userPassword} from './user-function.cy.js';
import {siteURL} from './function.cy.js';

describe("Login Validation", () => {

   beforeEach(() => {
      cy.visit(siteURL + "/login");
   });

   it("Empty field(s)", () => {
      cy.get('button').click(); //immediately click login button
      cy.url().should('include', '/login');
      cy.contains("Email or password is empty. ").should('be.visible');

   });

   it("Invalid Username or Email", () => {
      func.login(userEmail, "invalidPassword");
      cy.url().should('include', '/login');
      cy.contains("Email or password does not match any records. ").should('be.visible');
   });

   it("Valid Login", () => {
      func.login(userEmail, userPassword);
      cy.url().should('eq', siteURL + "/dashboard");
   });

   it("Logout", () => {
      func.login(userEmail, userPassword);
      func.logout();
      cy.contains('logged out').should('be.visible');
   });

});

//Registration data sets for testing
const registerData = [
   //Valid [0]
   {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@gmail.com",
      password: "password1234",
      confirmPassword: "password1234",
   },
   //Invalid Email [1]
   {
      firstName: "Jane",
      lastName: "Doe",
      email: "janedoe",
      password: "password123",
      confirmPassword: "password123",
   },
   //Password Mismatch [2]
   {
      firstName: "Jane",
      lastName: "Doe",
      email: "janedoe@gmail.com",
      password: "password123",
      confirmPassword: "password",
   },
   //Empty Field(s) [3]
   {
      firstName: " ",
      lastName: "Doe",
      email: "test@email.com",
      password: "password123",
      confirmPassword: "password123",
   },
];

describe("User Registration", () => {

   beforeEach(() => {
      cy.visit(siteURL + "/register");
   });

   it("Valid Registration", () => {
      user.registerUser(registerData[0]);
      cy.contains("Successful").should("be.visible");
      cy.url().should('include', '/dashboard');
   });

   it("Duplicate Email", () => {
      user.registerUser(registerData[0]);
      cy.url().should('include', '/register');
      cy.contains("This email has already been used.").should("be.visible");
   });
  
   it("Invalid Email", () => {
      user.registerUser(registerData[1]);
      cy.url().should('include', '/register');
      cy.contains("Email is invalid").should("be.visible");
   });

   it("Password Mismatch", () => {
      user.registerUser(registerData[2]);
      cy.contains("Password do not match").should("be.visible");
      cy.url().should('include', '/register');
   });
   it("Empty Field(s)", () => {
      user.registerUser(registerData[3]);
      cy.contains("fields is empty").should("be.visible");
      cy.url().should('include', '/register');
   });

   //TODO: after ALL tests are done -> delete created test user
   after(() => {
      cy.request('DELETE', "api/v1/deleteUser/" + registerData[0].email)
   });
});

const vehicleData = [
   //Valid Registration [0]
   {
      classType: "SEDAN",
      carBrand: "Toyota",
      plateNumber: "123ABC1234"
   },
   //Invalid Plate Number [1]
   {
      classType: "SEDAN",
      carBrand: "Toyota",
      plateNumber: "11ABC1203187"
   },
   //Duplicate Plate Number [2]
   {
      classType: "COUPE",
      carBrand: "Toyota",
      plateNumber: "123ABC1234"
   }

]; 
describe("Vehicle Registration", () => {
   beforeEach(() => {
      cy.visit(siteURL + "/login");
      func.login(userEmail, userPassword);
      cy.url().should('include', '/dashboard');

   });

   it("Valid Vehicle Registration", () => {
      user.registerVehicle(vehicleData[0]);
      cy.contains("Your car has been added").should("be.visible");
      cy.contains(vehicleData[0].plateNumber).should("exist");
   });

   it("Invalid Plate Number", () => {
      user.registerVehicle(vehicleData[1]);
      cy.contains("Plate number must be in the format 3Digits3Letters4Digits.").should("be.visible");
   });

   it("Duplicate Plate Number", () => {
      user.registerVehicle(vehicleData[2]);
      cy.contains("plate number already exists").should("be.visible");
   });

   //after ALL tests are done -> delete created test vehicle
   after (() => {
      cy.request('DELETE', "api/v1/deleteVehicle/" + vehicleData[0].plateNumber)
   });

});

const reviewText = "This is a review for testing purposes.";
const editText = "This is an edited review for testing purposes.";

describe("Service Reviews", () => {
   beforeEach (() => {
      cy.visit(siteURL + "/login");
      func.login(userEmail, userPassword);
      cy.url().should('include', '/dashboard');
   });
   it("Add Review", () => {
      cy.get(':nth-child(3) > .car-status > :nth-child(1)').should('contain', 'To Review');
      user.createReview(reviewText);
      cy.contains("Your review has been successfully posted").should('be.visible');
      //TODO: Login on another account to check if review is visible
   });

   it("Edit Review", () => {
      cy.get('[href="/services"]').click();
      cy.get('#userReviewBtn').click();
      cy.get('#edit-review').click({ force: true });
      cy.get('#reviewEditText').clear();
      cy.get('#reviewEditText').type(editText);
      cy.get('#submitEditReview').click();
      cy.contains("Your review has been successfully updated").should('be.visible');
      cy.contains(editText).should('be.visible');
   });

   it("Delete Review", () => {
      cy.get('[href="/services"]').click();
      cy.get('#userReviewBtn').click();
      cy.get('#delete-review').click({ force: true });
      cy.contains("Your review has been successfully deleted").should('be.visible');
      cy.get('.review-container').children().should('have.length', 0);
   });


});