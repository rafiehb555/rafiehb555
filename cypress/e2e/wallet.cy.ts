describe('Wallet Operations', () => {
  beforeEach(() => {
    cy.login(); // Custom command to handle authentication
    cy.visit('/wallet');
  });

  it('should display wallet balance', () => {
    cy.get('[data-testid="wallet-balance"]').should('be.visible');
    cy.get('[data-testid="wallet-balance"]').should('contain', '$');
  });

  it('should make a deposit', () => {
    const amount = '100';
    cy.get('[data-testid="deposit-button"]').click();
    cy.get('[data-testid="amount-input"]').type(amount);
    cy.get('[data-testid="deposit-submit"]').click();
    cy.get('[data-testid="transaction-success"]').should('be.visible');
    cy.get('[data-testid="wallet-balance"]').should('contain', amount);
  });

  it('should view transaction history', () => {
    cy.get('[data-testid="transaction-history"]').should('be.visible');
    cy.get('[data-testid="transaction-item"]').should('have.length.at.least', 1);
  });

  it('should filter transactions by type', () => {
    cy.get('[data-testid="filter-deposits"]').click();
    cy.get('[data-testid="transaction-item"]').each($el => {
      cy.wrap($el).should('contain', 'Deposit');
    });
  });

  it('should handle failed transactions gracefully', () => {
    cy.intercept('POST', '/api/wallet/transactions', {
      statusCode: 400,
      body: { error: 'Invalid amount' },
    }).as('failedTransaction');

    cy.get('[data-testid="deposit-button"]').click();
    cy.get('[data-testid="amount-input"]').type('-100');
    cy.get('[data-testid="deposit-submit"]').click();
    cy.get('[data-testid="transaction-error"]').should('be.visible');
    cy.get('[data-testid="transaction-error"]').should('contain', 'Invalid amount');
  });
});
