import { AddTodoPage } from 'cypress/support/add-todo.po';
import { Todo } from 'src/app/Todos/todo';

describe('Add todo', () => {
  const page = new AddTodoPage();

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getTitle().should('have.text', 'New todo');
  });

  it('Should enable and disable the add todo button', () => {
    // ADD todo button should be disabled until all the necessary fields
    // are filled. Once the last (`#bodyField`) is filled, then the button should
    // become enabled.
    page.addTodoButton().should('be.disabled');
    page.getFormField('owner').type('test');
    page.addTodoButton().should('be.disabled');
    page.getFormField('body').type('20');
    page.addTodoButton().should('be.disabled');
    page.getFormField('category').type('iii');
    cy.get('[data-test=todoStatusSelect]').click().get(`mat-option[value="${'complete'}"]`).click();
    // all the required fields have valid input, then it should be enabled
    page.addTodoButton().should('be.enabled');
  });

  it('Should show error messages for invalid inputs', () => {
    // Before doing anything there shouldn't be an error
    cy.get('[data-test=ownerError]').should('not.exist');
    // Just clicking the owner field without entering anything should cause an error message
    page.getFormField('owner').click().blur();
    cy.get('[data-test=ownerError]').should('exist').and('be.visible');
    // Some more tests for various invalid owner inputs
    page.getFormField('owner').type('J').blur();
    cy.get('[data-test=ownerError]').should('exist').and('be.visible');
    page.getFormField('owner').clear().type('This is a very long owner that goes beyond the 50 character limit').blur();
    cy.get('[data-test=ownerError]').should('exist').and('be.visible');
    // Entering a valid owner should remove the error.
    page.getFormField('owner').clear().type('John Smith').blur();
    cy.get('[data-test=ownerError]').should('not.exist');

    // Before doing anything there shouldn't be an error
    cy.get('[data-test=categoryError]').should('not.exist');
    // Just clicking the age field without entering anything should cause an error message
    page.getFormField('category').click().blur();
    // Some more tests for various invalid age inputs
    cy.get('[data-test=categoryError]').should('exist').and('be.visible');
    page.getFormField('category').type('5').blur();
    cy.get('[data-test=categoryError]').should('exist').and('be.visible');
    page.getFormField('category').clear().type('asd').blur();
    cy.get('[data-test=categoryError]').should('not.exist');

    // Before doing anything there shouldn't be an error
    cy.get('[data-test=bodyError]').should('not.exist');
    // Just clicking the body field without entering anything should cause an error message
    page.getFormField('body').click().blur();
    // Some more tests for various invalid body inputs
    cy.get('[data-test=bodyError]').should('exist').and('be.visible');
    page.getFormField('body').type('a').blur();
    cy.get('[data-test=bodyError]').should('exist').and('be.visible');
    page.getFormField('body').clear().type('@example.com').blur();
    cy.get('[data-test=bodyError]').should('not.exist');
  });

  describe('Adding a new todo', () => {

    beforeEach(() => {
      cy.task('seed:database');
    });

    it('Should go to the right page, and have the right info', () => {
      const todo: Todo = {
        _id: null,
        owner: 'Test Todo',
        category: '30',
        status: false,
        body: 'test@example.com',
      };

      page.addTodo(todo);

      // New URL should end in the 24 hex character Mongo ID of the newly added todo
      cy.url()
        .should('match', /\/todos\/[0-9a-fA-F]{24}$/)
        .should('not.match', /\/todos\/new$/);

      // The new todo should have all the same attributes as we entered
      cy.get('.todo-card-owner').should('contain.text', todo.owner);
      cy.get('.todo-card-category').should('contain.text', todo.category);
      cy.get('#todo-card-status').should('contain.text', todo.status ? 'Status: Complete' : 'Status: Incomplete');
      cy.get('.todo-card-body').should('contain.text', todo.body);

      // We should see the confirmation message at the bottom of the screen
      cy.get('.mat-simple-snackbar').should('contain', `Added Todo ${todo.owner}`);
    });
  });

});
