//Used by both User/Admin tests

export const siteURL = "http://localhost:3000"; //TODO: change later to hosted link

export function login(email, password) {
  cy.url().should('include', '/login'); //check if on login page
  cy.get('input[name=email]').type(email);
  cy.get('input[name=password]').type(password);
  cy.get('button').click();
}

export function logout() {
  cy.get('.dropbtn.user-link span').should('contain', 'Hello');
  cy.get('.dropbtn.user-link').trigger('mouseover');
  //TODO: Update when Logout is fixed, try to refrain from using force
  cy.get('.dropdown-content a').contains('Log Out').click({ force: true });
}
