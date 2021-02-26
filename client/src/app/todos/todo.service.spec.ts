import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Todo } from './todo';

import { TodoService } from './todo.service';



describe('TodoService', () => {
  let service: TodoService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  const testTodos: Todo[] = [
    {
      _id: 'bryce_id',
      owner: 'Bryce',
      status: false,
      body: 'This is a body paragraph. #1',
      category: 'dance'
    },
    {
      _id: 'kelly_id',
      owner: 'Kelly',
      status: true,
      body: 'This is a body paragraph. #2',
      category: 'homework'
    },
    {
      _id: 'jamie_id',
      owner: 'Jamie',
      status: false,
      body: 'This is a body paragraph. #3',
      category: 'video games'
    },
    ];
  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule],
      providers: [HttpClientModule]});
    // service = TestBed.inject(TodoService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = new TodoService(httpClient);
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('getTodoByID()', () => {
    it('calls api/Todos/id with the correct ID', () => {
      const targetTodo: Todo = testTodos[1];
      const targetId: string = targetTodo._id;

      service.getTodoById(targetId).subscribe(
        todo => expect(todo).toBe(targetTodo)
      );

      const expectedUrl: string = service.todoUrl + '/' + targetId;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toEqual('GET');

      req.flush(targetTodo);
    });
  });
});
