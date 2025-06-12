describe('SQL Level Access Control', () => {
  beforeEach(() => {
    // Mock authentication
    cy.intercept('GET', '/api/auth/session', {
      body: {
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
        },
      },
    }).as('getSession');

    // Mock SQL level check
    cy.intercept('GET', '/api/sql/verify', {
      body: {
        success: true,
        level: 2,
        isActive: true,
        hasLoyaltyLock: true,
      },
    }).as('verifySQL');
  });

  it('should allow access to basic features for level 1 users', () => {
    cy.visit('/ehb-dashboard/sql');
    cy.wait('@getSession');
    cy.wait('@verifySQL');

    // Check if basic features are visible
    cy.get('[data-testid="sql-basic-features"]').should('be.visible');
    cy.get('[data-testid="sql-advanced-features"]').should('not.exist');
  });

  it('should show upgrade prompt for restricted features', () => {
    cy.visit('/ehb-dashboard/sql/advanced');
    cy.wait('@getSession');
    cy.wait('@verifySQL');

    // Check if upgrade prompt is shown
    cy.get('[data-testid="sql-upgrade-prompt"]').should('be.visible');
    cy.get('[data-testid="sql-upgrade-button"]').should('be.visible');
  });

  it('should display correct SQL level badge', () => {
    cy.visit('/ehb-dashboard/sql');
    cy.wait('@getSession');
    cy.wait('@verifySQL');

    cy.get('[data-testid="sql-level-badge"]').should('be.visible').and('contain', 'Level 2');
  });

  it('should show loyalty lock status', () => {
    cy.visit('/ehb-dashboard/sql');
    cy.wait('@getSession');
    cy.wait('@verifySQL');

    cy.get('[data-testid="loyalty-lock-status"]').should('be.visible').and('contain', 'Active');
  });

  it('should handle SQL level check errors gracefully', () => {
    // Mock error response
    cy.intercept('GET', '/api/sql/verify', {
      statusCode: 500,
      body: {
        success: false,
        error: 'Internal server error',
      },
    }).as('verifySQLError');

    cy.visit('/ehb-dashboard/sql');
    cy.wait('@getSession');
    cy.wait('@verifySQLError');

    // Check if error message is displayed
    cy.get('[data-testid="error-message"]')
      .should('be.visible')
      .and('contain', 'Error loading SQL level');
  });
});
