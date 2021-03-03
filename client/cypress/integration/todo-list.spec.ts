import { TodoListPage } from '../support/todo-list.po';

const page = new TodoListPage();

describe('Todo list', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });


  it('Should type something in the owner filter and check that it returned correct elements', () => {
    // Filter for Todo 'Fry'
    cy.get('[data-test=todoOwnerInput]').type('Fry');

    // All of the Todo cards should have the owner we are filtering by
    page.getTodoCards().each(e => {
      cy.wrap(e).find('.todo-card-owner').should('have.text', 'Fry');
    });

    // (We check this two ways to show multiple ways to check this)
    page.getTodoCards().find('.todo-card-owner').each(el =>
      expect(el.text()).to.equal('Fry')
    );
  });


  it('Should type something partial in the body filter and check that it returned correct elements', () => {
    // Filter for companies that contain 'sit'
    cy.get('[data-test=todoBodyInput]').type('sit');

    page.getTodoCards().should('have.lengthOf.above', 0);

    // Go through each of the cards that are being shown and get the companies
    page.getTodoCards().find('.todo-card-body')
      // We should see these companies
      .should('contain.text', 'sit');
  });


  it('Should select a status and check that it returned correct elements', () => {
    // Filter for status 'complete');
    page.selectStatus(true);

    // Some of the Todos should be listed
    page.getTodoCards().should('have.lengthOf.above', 0);

    // All of the Todo list items that show should have the status we are looking for
    page.getTodoCards().each(el => {
      cy.wrap(el).find('#status').should('contain', 'Complete');
    });
  });

  it('Should click view profile on a Todo and go to the right URL', () => {
    page.getTodoCards().first().then((card) => {
      const firstTodoOwner = card.find('.todo-card-owner').text();

      // When the view profile button on the first Todo card is clicked, the URL should have a valid mongo ID
      page.clickViewProfile(page.getTodoCards().first());

      // The URL should be '/Todos/' followed by a mongo ID
      cy.url().should('match', /\/todos\/[0-9a-fA-F]{24}$/);

      // On this profile page we were sent to, the owner and category should be correct
      cy.get('.todo-card-owner').first().should('have.text', firstTodoOwner);
    });
   });

  it('Should click add Todo and go to the right URL', () => {
    // Click on the button for adding a new Todo
    page.addTodoButton().click();

    // The URL should end with '/Todos/new'
    cy.url().should(url => expect(url.endsWith('/todos/new')).to.be.true);

    // On the page we were sent to, We should see the right title
    cy.get('.add-todo-title').should('have.text', 'New todo');
  });

});
