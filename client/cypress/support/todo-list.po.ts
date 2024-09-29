export class TodoListPage {
  private readonly baseUrl = '/todos';
  private readonly pageTitle = '.todo-list-title';
  private readonly todoCardSelector = '.todo-cards-container app-todo-card';
  private readonly todoListItemsSelector = '.todo-nav-list .todo-list-item';
  // private readonly profileButtonSelector = '[data-test=viewProfileButton]';
  private readonly radioButtonSelector = `[data-test=viewTypeRadio] mat-radio-button`;
  // private readonly todoRoleDropdownSelector = '[data-test=todoRoleSelect]';
  private readonly dropdownOptionSelector = `mat-option`;
  private readonly addTodoButtonSelector = '[data-test=addTodoButton]';

  navigateTo() {
    return cy.visit(this.baseUrl);
  }

  /**
   * Gets the title of the app when visiting the `/users` page.
   *
   * @returns the value of the element with the ID `.user-list-title`
   */
  getTodoTitle() {
    return cy.get(this.pageTitle);
  }

  /**
   * Get all the `app-user-card` DOM elements. This will be
   * empty if we're using the list view of the users.
   *
   * @returns an iterable (`Cypress.Chainable`) containing all
   *   the `app-user-card` DOM elements.
   */
   getTodoCards() {
    return cy.get(this.todoCardSelector);
  }

  /**
   * Get all the `.user-list-item` DOM elements. This will
   * be empty if we're using the card view of the users.
   *
   * @returns an iterable (`Cypress.Chainable`) containing all
   *   the `.user-list-item` DOM elements.
   */
  // getTodoListItems() {
  //   return cy.get(this.todoListItemsSelector);
  // }

  // /**
  //  * Clicks the "view profile" button for the given user card.
  //  * Requires being in the "card" view.
  //  *
  //  * @param card The user card
  //  */
  // clickViewProfile(card: Cypress.Chainable<JQuery<HTMLElement>>) {
  //   return card.find<HTMLButtonElement>(this.profileButtonSelector).click();
  // }

  /**
   * Change the view of users.
   *
   * @param viewType Which view type to change to: "card" or "list".
   */
  changeView(viewType: 'card' | 'list') {
    return cy.get(`${this.radioButtonSelector}[value="${viewType}"]`).click();
  }

  addTodoButton() {
    return cy.get(this.addTodoButtonSelector);
  }
}
