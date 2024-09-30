import { TodoListPage } from '../support/todo-list.po';

const page = new TodoListPage();

describe('Todo list', () => {
  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getTodoTitle().should('have.text', 'Todos');
  });

  // it('Should show 10 users in both card and list view', () => {
  //   page.getUserCards().should('have.length', 10);
  //   page.changeView('list');
  //   page.getUserListItems().should('have.length', 10);
  // });

  it('Should type something in the owner filter and check that it returned correct elements', () => {
    // Filter for owner Blanche
    cy.get('[data-test=todoOwnerInput]').type('Blanche');

    // All of the user cards should have the name we are filtering by
    page.getTodoCards().each(e => {
      cy.wrap(e).find('.todo-card-owner').should('have.text', 'Blanche');
    });
  });

  it('Should type something in the category filter and check that it returned correct elements', () => {
    // Filter for category groceries
    cy.get('[data-test=todoCategoryInput]').type('groceries');

    // All of the user cards should have the name we are filtering by
    page.getTodoCards().each(e => {
      cy.wrap(e).find('.todo-card-category').should('have.text', 'groceries');
    });
  });


});
