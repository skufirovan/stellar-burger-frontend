describe('Открытие и закрытие модального окна ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
  });

  it('открывает модалку при клике на ингредиент', () => {
    cy.get('[data-cy="ingredient-bun-643d69a5c3f7b9001cfa093c"]').click();

    cy.url().should('include', '/ingredients/643d69a5c3f7b9001cfa093c');

    cy.get('[data-cy="modal"]').should('be.visible');

    cy.get('[data-cy="modal"]').should(
      'contain.text',
      'Краторная булка N-200i'
    );
  });

  it('закрывает модалку по крестику', () => {
    cy.get('[data-cy="ingredient-bun-643d69a5c3f7b9001cfa093c"]').click();
    cy.get('[data-cy="modal-close-button"]').click();

    cy.get('[data-cy="modal"]').should('not.exist');

    cy.url().should('eq', 'http://localhost:4000/');
  });

  it('закрывает модалку по клику на оверлей', () => {
    cy.get('[data-cy="ingredient-bun-643d69a5c3f7b9001cfa093c"]').click();
    cy.get('[data-cy="modal-overlay"]').click({ force: true });

    cy.get('[data-cy="modal"]').should('not.exist');
  });
});
