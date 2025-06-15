import { SELECTORS } from '../selectors';

describe('Добавление ингредиента в конструктор', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('добавляет булку и начинку в конструктор', () => {
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
  });
});
