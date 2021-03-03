import { Todo } from 'src/app/todos/todo';

export class TodoListPage {
  navigateTo() {
    return cy.visit('/todos');
  }

  getTodoCards() {
    return cy.get('.todo-cards-container app-todo-card');
  }

  getTodoListItems() {
    return cy.get('.todo-nav-list .todo-list-item');
  }

  /**
   * Clicks the "view profile" button for the given todo card.
   * Requires being in the "card" view.
   *
   * @param card The todo card
   */
  clickViewProfile(card: Cypress.Chainable<JQuery<HTMLElement>>) {
    return card.find<HTMLButtonElement>('[data-test=viewProfileButton]').click();
  }

  addTodoButton() {
    return cy.get('[data-test=addTodoButton]');
  }

  selectStatus(bool: boolean){
    const value = bool === true ? 'complete' : 'incomplete';
    cy.get('[data-test=todoStatusSelect]').click().get(`mat-option[value="${value}"]`).click();
  }
}


