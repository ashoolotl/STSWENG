

const siteURL = 'http://localhost:3000'; // Change later to hosted link
// Admin test logins
const adminLogin = "admin@wilson.io";
const adminPassword = "test1234";
// User test logins
const userLogin = "wilson@example.com";
const userPassword = "test1234";




function login(email, password) {
  cy.get('input[name=email]').type(email);
  cy.get('input[name=password]').type(password);
  cy.get('button').click();
}


//TODO: When HTML popups are implemented, Cypress doesn't detect current popups.
describe('Invalid Logins', () => {

  beforeEach(() => {
    cy.visit(siteURL + '/login');
  });

  it.skip('Empty email', () => {
    cy.get('button').click();
    cy.contains('Please fill out this field').should('be.visible');
  });

  it.skip('Empty password', () => {
  });

  it.skip('Invalid Credentials', () => {
  });

});

describe('Valid Logins', () => {
  beforeEach(() => {
    cy.visit(siteURL + '/login');
  });

  it('User login', () => {
    login(userLogin, userPassword);
    cy.url().should("eq", siteURL + "/dashboard");
    cy.contains('Registered Cars').should('be.visible');
  });
  
  it('Admin login', () => {
    login(adminLogin, adminPassword);
    cy.url().should("eq", siteURL + "/dashboard");
    cy.contains('Service Bookings').should('be.visible');
  });
});