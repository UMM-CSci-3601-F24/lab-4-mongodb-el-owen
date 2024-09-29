import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { MockTodoService } from '../../testing/todo.service.mock';
import { Todo } from './todo';
import { TodoCardComponent } from './todo-card.component';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from './todo.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const COMMON_IMPORTS: unknown[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioModule,
  MatIconModule,
  MatSnackBarModule,
  BrowserAnimationsModule,
  RouterTestingModule,
];

describe('Todo list', () => {
  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS, TodoListComponent, TodoCardComponent],
      providers: [{provide: TodoService, useValue: new MockTodoService() }],
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoListComponent);
      todoList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('contains all the todos', () => {
    expect(todoList.serverFilteredTodos().length).toBe(3);
  })
  it('contains a todo with category Video Games', () => {
    expect(todoList.serverFilteredTodos().some((todo: Todo) => todo.category === 'video games')).toBe(true);
  });
  // it('contain a todo with esse in the body', () => {
  //   // expect(todoList.serverFilteredTodos().some((todo: Todo) => todo.body === 'Jamie')).toBe(true);
  // });
});
describe('Misbehaving Todo List', () => {
  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  let todoServiceStub: {
    getTodos: () => Observable<Todo[]>;
  };

  beforeEach(() => {
     todoServiceStub = {
      getTodos: () => new Observable(observer => {
        observer.error('getTodos() Observer generates an error');
      }),
    };

    TestBed.configureTestingModule({
    imports: [COMMON_IMPORTS, TodoListComponent],
    // providers:    [ UserService ]  // NO! Don't provide the real service!
    // Provide a test-double instead
    providers: [{ provide: TodoService, useValue: todoServiceStub }],
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoListComponent);
      todoList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it("generates an error if we don't set up a UserListService", () => {
    expect(todoList.serverFilteredTodos())
      .withContext("service can't give values to the list if it's not there")
      .toEqual([]);
    expect(todoList.errMsg())
      .withContext('the error message will be')
      .toContain('Problem contacting the server – Error Code:');
      console.log(todoList.errMsg);
  });
});
