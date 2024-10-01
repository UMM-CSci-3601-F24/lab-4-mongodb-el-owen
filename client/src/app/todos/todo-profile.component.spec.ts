import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TodoProfileComponent } from './todo-profile.component';
import { MockTodoService } from 'src/testing/todo.service.mock';
import { ActivatedRouteStub } from 'src/testing/activated-route-stub';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { TodoCardComponent } from './todo-card.component';
import { TodoService } from './todo.service';
import { ActivatedRoute } from '@angular/router';
import { Todo } from './todo';

describe('TodoProfileComponent', () => {
  let component: TodoProfileComponent;
  let fixture: ComponentFixture<TodoProfileComponent>;
  const mockTodoService = new MockTodoService();
  const fryId = 'Fry_id';
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub({
    id : fryId
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        RouterTestingModule,
        MatCardModule,
        TodoProfileComponent,
        TodoCardComponent
    ],
    providers: [
        { provide: TodoService, useValue: mockTodoService },
        { provide: ActivatedRoute, useValue: activatedRoute }
    ]
  }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to a specific todo profile', () => {
    const expectedTodo: Todo = MockTodoService.testTodos[2];
    activatedRoute.setParamMap({ id: expectedTodo._id });
    expect(component.todo()).toEqual(expectedTodo);
  });

  it('should have `null` for the todo for a bad ID', () => {
    activatedRoute.setParamMap({ id: 'badID' });
    expect(component.todo()).toBeNull();
  });

});
