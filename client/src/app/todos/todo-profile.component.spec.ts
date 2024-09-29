import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoProfileComponent } from './todo-profile.component';

describe('TodoProfileComponent', () => {
  let component: TodoProfileComponent;
  let fixture: ComponentFixture<TodoProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
