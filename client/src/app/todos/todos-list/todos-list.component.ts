import { TodoService } from './../todo.service';
import { Component, OnInit } from '@angular/core';
import { Todo } from '../todo';
import { Filter } from 'src/app/todos/filter';

@Component({
  selector: 'app-todos-list',
  templateUrl: './todos-list.component.html',
  styleUrls: ['./todos-list.component.scss']
})
export class TodosListComponent implements OnInit {

  filteredTodos: Todo[];
  serverTodos: Todo[];

  owner: string;
  body: string;
  status: string;
  category: string;
  limit: number;
  sort: string;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.getTodosFromServer();
  }
  getTodosFromServer(filters?, afterThat?: (data) => void) {
    const obs = this.todoService.getTodos(filters);
    obs.subscribe(returnedTodos => {
      this.serverTodos = returnedTodos;
      this.update();
      if (afterThat) { afterThat(returnedTodos); }
    });
    return obs.toPromise();
  }

  public update(testingFilters?: Filter) {
    const filter: Filter = !testingFilters ? {
      body: this.body,
      owner: this.owner,
      category: this.category,
      status: this.status ? this.status === 'complete' : undefined,
    } : testingFilters;
    this.filteredTodos = this.todoService.filterTodos(this.serverTodos, filter);

    if (this.sort !== undefined) {
      this.filteredTodos = this.filteredTodos.sort((first, second) => {
        const a = first[this.sort];
        const b = second[this.sort];
        return a === b ? 0 : (a > b ? 1 : -1); // Return 1 if a>b, -1 if a<b and 0 otherwise
      });
    }

    if (this.limit) { this.filteredTodos = this.filteredTodos.slice(0, this.limit); }
  }
}
