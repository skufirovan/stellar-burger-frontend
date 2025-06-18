import { SELECTORS } from '../selectors';

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
        order: { number: 1234 }
      }
    }).as('postOrder');

    cy.visit('/');
    cy.wait(['@getUser', '@getIngredients']);
  });

  it('добавляет булку и начинку в конструктор и оформляет заказ', () => {
    cy.get(SELECTORS.bunItem).within(() => {
      cy.contains('Добавить').click({ force: true });
    });

    cy.get(SELECTORS.mainItem).within(() => {
      cy.contains('Добавить').click({ force: true });
    });

    cy.get(SELECTORS.constructorTop).should(
      'contain.text',
      'Краторная булка N-200i (верх)'
    );

    cy.get(SELECTORS.constructorList).should(
      'contain.text',
      'Филе Люминесцентного тетраодонтимформа'
    );

    cy.get(SELECTORS.constructorOrderBtn).within(() => {
      cy.contains('Оформить заказ').click({ force: true });
    });

    cy.get(SELECTORS.modal).should('be.visible');
    cy.get(SELECTORS.modal).should('contain.text', '1234');

    cy.get(SELECTORS.modalClose).click();
    cy.get(SELECTORS.modal).should('not.exist');

    cy.get(SELECTORS.constructorTop).should('contain.text', 'Выберите булки');
    cy.get(SELECTORS.constructorList).should(
      'contain.text',
      'Выберите начинку'
    );
  });
});
