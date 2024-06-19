

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