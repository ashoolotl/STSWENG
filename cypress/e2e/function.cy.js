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

export function selectDropdown(value) {
  // cy.get('.dropbtn.user-link').realHover();
  // cy.wait(3000)
  // cy.get('.dropdown-content').should('be.visible');
  // cy.contains(value).click();
  cy.get('.dropdown-content').contains(value).click({ force: true });
}

//NOTE: only works for pages on navbar
export function viewPage(page) {
  cy.get('a[href="/' + page + '"]').click();
  cy.url().should('include', '/' + page);
}