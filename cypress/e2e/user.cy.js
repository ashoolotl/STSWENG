import {siteURL} from './function.cy.js';
import * as func from './function.cy.js';
import * as user from './user-function.cy.js';
import {userEmail, userPassword} from './user-function.cy.js';
//non-cypress imports
import {deleteCarByPlateNumber, deleteUserByEmail} from '../../public/js/deleteCarAndUser.js';



//TODO: Add checking for error messages when implemented
describe("Login Validation", () => {

   beforeEach(() => {
      cy.visit(siteURL + "/login");
   });

   it("Both fields empty", () => {
      cy.get('button').click(); //immediately click login button
      cy.url().should('include', '/login');
      // cy.contains('Please fill out this field').should('be.visible');

   });

   it("No Email Inputted", () => {
      cy.get('input[name="password"]').type('password');
      cy.get('button').click();
      cy.url().should('include', '/login');
      // cy.contains('Please fill out this field').should('be.visible');

   });

   it("No Password Inputted", () => {
      cy.get('input[name="email"]').type('user@gmail.com');
      cy.get('button').click();
      cy.url().should('include', '/login');
      // cy.contains('Please fill out this field').should('be.visible');
   });

   it("Invalid Username or Email", () => {
      func.login(userEmail, "invalidPassword");
      cy.url().should('include', '/login');
      // cy.contains('Invalid Username or Email').should('be.visible');
   });

   it("Valid Login", () => {
      func.login(userEmail, userPassword);
      cy.url().should('include', '/dashboard');
   });

   it.skip("Logout", () => {
      func.login(userEmail, userPassword);
      func.logout();
      cy.on('window:alert', (message) => {
         expect(message).to.contain('logged out.');
      });
      cy.url().should('eq', siteURL);
   });

});



//Registtration data sets for testing
const registerData = [
   //Valid [0]
   {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@gmail.com",
      password: "password123",
      confirmPassword: "password123",
      // carsOwned: 
   },
   //Invalid Email [1]
   {
      firstName: "Jane",
      lastName: "Doe",
      email: "janedoe",
      password: "password123",
      confirmPassword: "password123",
      // carsOwned:
   },
   //Password Mismatch [2]
   {
      firstName: "Jane",
      lastName: "Doe",
      email: "janedoe@gmail.com",
      password: "password123",
      confirmPassword: "password",
      // carsOwned:
   },
   //Empty Field(s) [3]
   {
      firstName: " ",
      lastName: "Doe",
      email: "test@email.com",
      password: "password123",
      confirmPassword: "password123",
      // carsOwned:
   }
   
];

//TODO: After confirmation alert rendering is implemented
describe("User Registration", () => {

   beforeEach(() => {
      cy.visit(siteURL + "/register");
   });

   it("Valid Registration", () => {
      user.registerUser(registerData[0]);
      //TODO: Check if user receives confirmation alert
      cy.url().should('include', '/dashboard');
   });
  

   //Invalid Registrations
   it("Invalid Email", () => {
      user.registerUser(registerData[1]);
      //TODO: Check if user receives error alert (immediately after input)
      cy.url().should('include', '/register');
   });

   it("Password Mismatch", () => {
      user.registerUser(registerData[2]);
      //TODO: Check if user receives error alert (immediately after input)
      cy.url().should('include', '/register');
   });

   it("Empty Field(s)", () => {
      user.registerUser(registerData[3]);
      //TODO: Check if user receives error alert (immediately after input)
      cy.url().should('include', '/register');
   });

   //TODO: after ALL tests are done -> delete created test user
   after(() => {
      // cy.request('DELETE', "api/v1/User/johndoe@gmail.com")
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

   it.skip("Valid Vehicle Registration", () => {
      user.registerVehicle();
   });

   it.skip("Invalid Plate Number", () => {
      user.registerVehicle(vehicleData[1]);
      //TODO: Assertion when error messages are implemented
      // cy.contains("Please match the requested format").should("be.visible");
   });

   it("Duplicate Plate Number", () => {
      user.registerVehicle(vehicleData[2]);
      //TODO: Assertion when error messages are implemented
      cy.on('window:alert', (message) => {
         expect(message).to.include('duplicate key error');
      });
   });

   //TODO: after ALL tests are done -> delete created test vehicle
   after (() => {
      // cy.request('DELETE', "api/v1/Vehicle/123ABC1234")
   });

});
