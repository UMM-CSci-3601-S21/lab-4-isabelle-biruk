import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule,MatCardContent,MatCardTitle } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule,MatLabel,MatHint,MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Todo } from '../todo';
import { TodosListComponent } from './todos-list.component';
import { TodoCardComponent } from '../todo-card/todo-card.component';
import { Filter } from 'src/app/todos/filter';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule } from '@angular/router';
import { MockTodoService } from 'src/testing/todo.service.mock';
import { TodoService } from '../todo.service';


describe('TodosListComponent', () => {
  let todoList: TodosListComponent;
  let fixture: ComponentFixture<TodosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodosListComponent, TodoCardComponent],
      imports: [HttpClientTestingModule,RouterTestingModule,RouterModule.forRoot([]),],
      providers: [{ provide: TodoService, useValue: new MockTodoService() }]
    })
      .compileComponents();
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodosListComponent);
      todoList = fixture.componentInstance;
      fixture.detectChanges();
      todoList.getTodosFromServer();
    });
  }));

  it('fetches data from the server"', () => {
    expect(todoList.serverTodos.length).toBe(5);
  });
  it('filters by owner', () => {
    const filter: Filter = { owner: 'Blanche' };
    todoList.update(filter);

    todoList.filteredTodos.forEach(todo => {
      expect(todo.owner).toBe('Blanche');
    });
  });

  it('filters by category', () => {
    const filter: Filter = { category: 'groceries' };
    todoList.update(filter);

    todoList.filteredTodos.forEach(todo => {
      expect(todo.category).toBe('groceries');
    });
  });

  it('filters by status', () => {
    const filter: Filter = { status: true };
    todoList.update(filter);

    todoList.filteredTodos.forEach(todo => {
      expect(todo.status).toBe(true);
    });
  });
  it('filters by body', () => {
    const sampleBody: string = 'Proident nostrud eiusmod consectetur commodo consequat est deserunt'
    + ' proident nostrud esse voluptate occaecat. Reprehenderit pariatur aute laborum commodo.';

    const filter: Filter = {
      body: sampleBody
    };
    todoList.update(filter);

    todoList.filteredTodos.forEach(todo => {
      expect(todo.body).toBe(sampleBody);
    });
  });
});
