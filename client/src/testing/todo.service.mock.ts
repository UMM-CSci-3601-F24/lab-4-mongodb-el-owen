import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { Todo } from '../app/todos/todo';
import { TodoService } from '../app/todos/todo.service';

@Injectable({
  providedIn: AppComponent
})
export class MockTodoService extends TodoService {
  static testTodos: Todo[] = [
    {
      owner: "Blanche",
      "_id":"58af3a600343927e48e8720f",
      status: false,
      body: "In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis. Cillum non labore ex sint esse.",
      category: "software design",
    },
    {
      owner: 'Fry',
      _id: "58af3a600343927e48e87210",
      status: false,
      body: 'Ipsum esse est ullamco magna tempor anim laborum non officia deserunt veniam commodo. Aute minim incididunt ex commodo.',
      category: 'video games',
    },
    {
      owner: "Fry",
      _id: "58af3a600343927e48e87211",
      status: true,
      body: "Ullamco irure laborum magna dolor non. Anim occaecat adipisicing cillum eu magna in.",
      category: "homework",
    }
  ];

  constructor() {
    super(null);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTodos(_filters: {owner?: string; status?: string}): Observable<Todo[]> {
    return of(MockTodoService.testTodos);
  }
}

