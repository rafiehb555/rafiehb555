import '@testing-library/cypress/add-commands';

// Custom commands for authentication
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
  });
});

// Custom commands for wallet operations
Cypress.Commands.add('createTransaction', (type: 'deposit' | 'withdrawal', amount: number) => {
  cy.get('[data-testid="transaction-type"]').select(type);
  cy.get('[data-testid="transaction-amount"]').type(amount.toString());
  cy.get('[data-testid="transaction-submit"]').click();
});

// Custom commands for SQL operations
Cypress.Commands.add('checkSQLLevel', () => {
  cy.get('[data-testid="sql-level"]').should('be.visible');
});

// Type definitions for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      createTransaction(type: 'deposit' | 'withdrawal', amount: number): Chainable<void>;
      checkSQLLevel(): Chainable<void>;
    }
  }
}
