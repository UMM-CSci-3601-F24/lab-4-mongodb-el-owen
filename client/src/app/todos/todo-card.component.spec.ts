import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TodoCardComponent } from './todo-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
// import { input } from '@angular/core';
import { Todo } from './todo';

describe('TodoCardComponent', () => {
  let component: TodoCardComponent;
  let fixture: ComponentFixture<TodoCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MatCardModule, TodoCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoCardComponent);
    component = fixture.componentInstance;
    const todo: Todo = {
        _id: 'fry_id',
        owner: "fry",
        status: false,
        body: "hehehehe",
        category: 'groceries',
    }

    fixture.componentRef.setInput('todo', todo);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
