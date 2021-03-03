import { Todo } from 'src/app/Todos/Todo';

export class AddTodoPage {
  navigateTo() {
    return cy.visit('/todos/new');
  }

  getTitle() {
    return cy.get('.add-todo-title');
  }

  addTodoButton() {
    return cy.get('#confirmAddTodoButton');
  }

  selectMatSelectValue(select: Cypress.Chainable, value: string) {
    // Find and click the drop down
    return select.click()
      // Select and click the desired value from the resulting menu
      .get(`mat-option[value="${value}"]`).click();
  }

  getFormField(fieldname: string) {
    return cy.get(`mat-form-field [formcontrolname=${fieldname}]`);
  }

  addTodo(newTodo: Todo) {
    if (newTodo.owner) { this.getFormField('owner').type(newTodo.owner); }
    if (newTodo.category) { this.getFormField('category').type(newTodo.category); }
    if (newTodo.body) { this.getFormField('body').type(newTodo.body); }
    const value = newTodo.status === true ? 'complete' : 'incomplete';
    const check = newTodo.owner && newTodo.category && newTodo.body && newTodo.status !== undefined;
    cy.get('[data-test=todoStatusSelect]').click().get(`mat-option[value="${value}"]`).click();
    // this.selectMatSelectValue(this.getFormField('role'), newTodo.role);
    return !check ? this.addTodoButton() : this.addTodoButton().click();
  }
}
