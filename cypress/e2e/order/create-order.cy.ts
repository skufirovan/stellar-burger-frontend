describe('Оформление заказа', () => {
  beforeEach(() => {
    cy.setCookie('accessToken', 'test-access-token');

    cy.intercept('GET', '**/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('POST', '**/orders', {
      statusCode: 200,
      body: {
        success: true,
        name: 'Test Burger',
        order: {
          number: 1234
        }
      }
    }).as('postOrder');

    cy.visit('http://localhost:4000');
    cy.wait(['@getUser', '@getIngredients']);
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

    cy.get('[data-cy="constructor-order-button"]').within(() => {
      cy.contains('Оформить заказ').click({ force: true });
    });

    cy.get('[data-cy="modal"]').should('be.visible');

    cy.get('[data-cy="modal"]').should('contain.text', '1234');

    cy.get('[data-cy="modal-close-button"]').click();

    cy.get('[data-cy="modal"]').should('not.exist');

    cy.get('[data-cy="constructor-top"]').should(
      'contain.text',
      'Выберите булки'
    );

    cy.get('[data-cy="constructor-list"]').should(
      'contain.text',
      'Выберите начинку'
    );
  });
});
