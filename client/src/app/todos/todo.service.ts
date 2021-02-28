import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Filter } from './filter';
import { Todo } from './todo';



@Injectable({
  providedIn: 'root'
})
export class TodoService {

  readonly todoUrl: string = environment.apiUrl + 'todos';


  constructor(private httpClient: HttpClient) {
  }

  getTodos(filters?: Filter): Observable<Todo[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.id) {
        httpParams = httpParams.set('id', filters.id);
      }
      if (filters.owner) {
        httpParams = httpParams.set('owner', filters.owner);
      }
      if (filters.status) {
        httpParams = httpParams.set('status', String(filters.status));
      }
      if (filters.category) {
        httpParams = httpParams.set('category', filters.category);
      }
      if (filters.body) {
        httpParams = httpParams.set('body', filters.body);
      }
    }
    return this.httpClient.get<Todo[]>(this.todoUrl, {
      params: httpParams,
    });
  }

  getTodoById(id: string): Observable<Todo> {
    return this.httpClient.get<Todo>(this.todoUrl + '/' + id);
  }

  filterTodos(todos: Todo[], filters: Filter): Todo[] {
    return todos.filter(Filter.applyFilter(filters));
  }

  addTodo(newTodo: Todo): Observable<string> {
    // Send post request to add a new todo with the todo data as the body.
    return this.httpClient.post<{id: string}>(this.todoUrl, newTodo).pipe(map(res => res.id));
}
