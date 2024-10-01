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

  it('Should type something in the owner filter and check that it returned correct elements', () => {
    // Filter for owner Blanche
    cy.get('[data-test=todoOwnerInput]').type('Blanche');
    page.changeView('card');
    // All of the todo cards should have the Owner we are filtering by
    page.getTodoCards().each(e => {
      cy.wrap(e).find('.todo-card-owner').should('contain', 'Blanche');
    });
  });

  it('Should type something in partial the owner filter and check that it returned correct elements', () => {
    // Filter for owner Blanche
    cy.get('[data-test=todoOwnerInput]').type('Blan');
    page.changeView('card');
    // All of the todo cards should have the Owner we are filtering by
    page.getTodoCards().each(e => {
      cy.wrap(e).find('.todo-card-owner').should('contain', 'Blanche');
    });
  });

  it('Should type something in the body filter and check that it returned correct elements', () => {
    // Filter for owner Blanche
    cy.get('[data-test=todoBodyInput]').type('esse');
    page.changeView('card');
    // All of the todo cards should have the Owner we are filtering by
    page.getTodoCards().each(e => {
      cy.wrap(e).find('.todo-card-body').contains('Esse', {matchCase: false});
    });
  });

  it('Should type something in the category filter and check that it returned correct elements', () => {
    cy.get('[data-test=todoCategoryInput]').type('groceries');

    page.getTodoCards().each(e => {
      cy.wrap(e).find('.todo-card-category').should('contain', 'groceries');
    });
  });

  it('Should select a status and check that it returned the correct elements', () => {
    cy.get('[data-test=todoStatusSelect]').click();
    cy.get('mat-option').contains(/^Complete$/).click();
    page.changeView('list');
    page.getTodoListItems().each(e => {
      cy.wrap(e).find('.todo-list-status').should('have.text', 'Complete');
    });
  })

  it('Should change the view', () => {
    // Choose the view type "List"
    page.changeView('list');

    // We should not see any cards
    // There should be list items
    page.getTodoCards().should('not.exist');
    page.getTodoListItems().should('exist');

    // Choose the view type "Card"
    page.changeView('card');

    // There should be cards
    // We should not see any list items
    page.getTodoCards().should('exist');
    page.getTodoListItems().should('not.exist');
  });

  it('Should click view profile on a todo and go to the right URL', () => {
    page.changeView('list');
    page.getTodoListItems().first().then((list) => {

      const firstTodoOwner = list.find('.todo-list-owner').text();
      const firstTodoCategory = list.find('.todo-list-category').text();

      // When the view profile button on the first user card is clicked, the URL should have a valid mongo ID
      page.getTodoListItems().first().click();

      // The URL should be '/users/' followed by a mongo ID
      cy.url().should('match', /\/todos\/[0-9a-fA-F]{24}$/);

      // On this profile page we were sent to, the name and company should be correct
      cy.get('.todo-card-owner').first().should('contain', firstTodoOwner);
      cy.get('.todo-card-category').first().should('contain', firstTodoCategory);
    });
  });

  it('Should click add todo and go to the right URL', () => {
    // Click on the button for adding a new user
    page.addTodoButton().click();

    // The URL should end with '/users/new'
    cy.url().should(url => expect(url.endsWith('/todos/new')).to.be.true);

    // On the page we were sent to, We should see the right title
    cy.get('.add-todo-title').should('have.text', 'New Todo');
  });
});
