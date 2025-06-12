declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
      logout(): Chainable<void>;
      seedDatabase(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (email = 'test@example.com', password = 'password123') => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="login-submit"]').click();
    cy.url().should('not.include', '/login');
  });
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="logout-button"]').click();
  cy.url().should('include', '/login');
});

Cypress.Commands.add('seedDatabase', () => {
  cy.request('POST', '/api/test/seed', {
    email: 'test@example.com',
    password: 'password123',
    balance: 1000,
  });
});
