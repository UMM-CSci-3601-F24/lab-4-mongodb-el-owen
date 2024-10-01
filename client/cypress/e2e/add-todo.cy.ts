import { Todo } from "src/app/todos/todo";
import { AddTodoPage } from '../support/add-todo.po';

describe('Add todo', () => {
  const page = new AddTodoPage();

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getTitle().should('have.text', 'New Todo');
  });

  it('Should enable and disable add todo button', () => {
    page.addTodoButton().should('be.disabled');
    page.getFormField('owner').type('test');
    page.addTodoButton().should('be.disabled');
    page.getFormField('body').type('test body');
    page.addTodoButton().should('be.disabled');
    page.getFormField('category').type('test category');
    page.addTodoButton().should('be.enabled');
  });

  it('should show error messages for invalid inputs', () => {
    cy.get('[data-test=ownerError]').should('not.exist');
    page.getFormField('owner').click().blur();
    cy.get('[data-test=ownerError]').should('exist').and('be.visible');
    //test for name length
    // commented out because we allow one letter names
    // page.getFormField('owner').type('L').blur();
    // cy.get('[data-test=ownerError]').should('exist').and('be.visible');
    page.getFormField('owner').type('El').blur();
    cy.get('[data-test=ownerError]').should('not.exist');

    cy.get('[data-test=categoryError]').should('not.exist');
    page.getFormField('category').click().blur();
    cy.get('[data-test=categoryError]').should('exist').and('be.visible');
    page.getFormField('category').clear().type('groceries').blur();
    cy.get('[data-test=categoryError]').should('not.exist');


    cy.get('[data-test=bodyError]').should('not.exist');
    page.getFormField('body').click().blur();
    cy.get('[data-test=bodyError]').should('exist').and('be.visible');
    page.getFormField('body').clear().type('hehehehehe').blur();
    cy.get('[data-test=bodyError]').should('not.exist');
  });

  describe('add new todo', () => {
    beforeEach(() => {
      cy.task('seed:database');
    });

    it('should go to correct page and have right information', () => {
      const todo: Todo = {
        _id: null,
        owner: "Test McGee",
        category: "pet maintenance",
        body: "take my short haired pug on a long walk",
        status: false,
      }

      page.addTodo(todo);

      cy.url({ timeout: 10000 })
        .should('match', /\/todos\/[0-9a-fA-F]{24}$/)
        .should('not.match', /\/todos\/new$/);
      cy.get('.todo-card-owner').should('contain', todo.owner);
      cy.get('.todo-card-category').should('contain', todo.category);
      cy.get('.todo-card-body').should('contain', todo.body);
      // cy.get('.todo-card-status').get('mat-icon').should('contain', 'incomplete');

    })
  })
})
