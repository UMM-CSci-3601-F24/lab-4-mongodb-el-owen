import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
// import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment';
import { Todo } from './todo';
import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

@Injectable({
  providedIn: `root`
})
export class TodoService {
  readonly todoUrl: string = `${environment.apiUrl}todos`;

  private readonly ownerKey = 'owner';
  private readonly statusKey = 'status';

  constructor(private httpClient: HttpClient) {
  }

  getTodos(filters?: { owner?: string; status?: string}): Observable<Todo[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.owner) {
        httpParams = httpParams.set(this.ownerKey, filters.owner);
      }
      if (filters.status) {
        httpParams = httpParams.set(this.statusKey, filters.status.toString());
      }
    }
    return this.httpClient.get<Todo[]>(this.todoUrl, {
      params: httpParams,
    });
  }

  getTodoById(id: string): Observable<Todo> {
    return this.httpClient.get<Todo>(`${this.todoUrl}/${id}`);
  }

  filterTodos(todos: Todo[], filters: {body?: string; category?: string}): Todo[] {
    let filteredTodos = todos;

    // Filter by body
    if (filters.body) {
      filters.body = filters.body.toLowerCase();
      filteredTodos = filteredTodos.filter(todo => todo.body.toLowerCase().indexOf(filters.body) !== -1);
    }
    if (filters.category) {
      filters.category = filters.category.toLowerCase();
      filteredTodos = filteredTodos.filter(todo => todo.category.toLowerCase().indexOf(filters.category) !== -1);
    }
    return filteredTodos;
  }

  //depreciated
  // limitTodos(todos: Todo[], limit: number): Todo[] {
  //   if (limit < 0) {
  //     throw new Error("Limit must be a non-negative number.");
  //   }
  //   return todos.slice(0, limit);
  // }
}
