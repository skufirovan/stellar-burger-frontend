import { SELECTORS } from '../selectors';

describe('Открытие и закрытие модального окна ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('открывает модалку при клике на ингредиент', () => {
    cy.get(SELECTORS.bunItem).click();

    cy.url().should('include', '/ingredients/643d69a5c3f7b9001cfa093c');

    cy.get(SELECTORS.modal).should('be.visible');

    cy.get(SELECTORS.modal).should('contain.text', 'Краторная булка N-200i');
  });

  it('закрывает модалку по крестику', () => {
    cy.get(SELECTORS.bunItem).click();
    cy.get(SELECTORS.modalClose).click();

    cy.get(SELECTORS.modal).should('not.exist');

    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('закрывает модалку по клику на оверлей', () => {
    cy.get(SELECTORS.bunItem).click();
    cy.get(SELECTORS.modalOverlay).click({ force: true });

    cy.get(SELECTORS.modal).should('not.exist');
  });
});
