describe('Добавление ингредиента в конструктор', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
  });

  it('добавляет булку и начинку в конструктор', () => {
    cy.get('[data-cy="ingredient-bun-643d69a5c3f7b9001cfa093c"]').within(() => {
      cy.contains('Добавить').click({ force: true });
    });

    cy.get('[data-cy="ingredient-main-643d69a5c3f7b9001cfa093e"]').within(
      () => {
        cy.contains('Добавить').click({ force: true });
      }
    );

    cy.get('[data-cy="constructor-top"]').should(
      'contain.text',
      'Краторная булка N-200i (верх)'
    );

    cy.get('[data-cy="constructor-list"]').should(
      'contain.text',
      'Филе Люминесцентного тетраодонтимформа'
    );
  });
});
