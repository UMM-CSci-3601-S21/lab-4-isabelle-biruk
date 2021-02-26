import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Filter } from 'src/app/todos/filter';
import { Todo } from 'src/app/todos/todo';
import { TodoService } from 'src/app/todos/todo.service';

/**
 * A 'mock' version of the `TodoService` that can be used to test components
 * without having to create an actual service.
 */
@Injectable()
export class MockTodoService extends TodoService {
  static testTodos: Todo[] = [
    {
      _id: '58895985a22c04e761776d54',
      owner: 'Blanche',
      status: false,
      body: 'In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis. Cillum non labore ex sint esse.',
      category: 'software design'
    },
    {
      _id: '58895985c1849992336c219b',
      owner: 'Fry',
      status: false,
      body: 'Ipsum esse est ullamco magna tempor anim laborum non officia deserunt veniam commodo. Aute minim incididunt ex commodo.',
      category: 'video games'
    },
    {
      _id: '58895985ae3b752b124e7663',
      owner: 'Fry',
      status: true,
      body: 'Ullamco irure laborum magna dolor non. Anim occaecat adipisicing cillum eu magna in.',
      category: 'homework'
    },
    {
      _id: '58895985186754887e0381f5',
      owner: 'Blanche',
      status: true,
      body: 'Incididunt enim ea sit qui esse magna eu. Nisi sunt exercitation est Lorem consectetur incididunt.',
      category: 'software design'
    },
    {
      _id: '5889598555fbbad472586a56',
      owner: 'Blanche',
      status: true,
      body: 'Aliqua esse aliqua veniam id nisi ea. Ullamco Lorem ex aliqua aliquip cupidatat incididunt reprehenderit.',
      category: 'groceries'
    }
  ];

  constructor() {
    super(null);
  }

  getTodos(filters: Filter): Observable<Todo[]> {
    // Our goal here isn't to test (and thus rewrite) the service, so we'll
    // keep it simple and just return the test Todos regardless of what
    // filters are passed in.
    return of(MockTodoService.testTodos);
  }

  getTodoById(id: string): Observable<Todo> {
    // If the specified ID is for the first test Todo,
    // return that Todo, otherwise return `null` so
    // we can test illegal Todo requests.
    if (id === MockTodoService.testTodos[0]._id) {
      return of(MockTodoService.testTodos[0]);
    } else {
      return of(null);
    }
  }

}
