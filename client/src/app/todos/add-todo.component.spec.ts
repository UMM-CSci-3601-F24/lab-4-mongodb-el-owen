import { Location } from '@angular/common';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, flush, tick, waitForAsync } from '@angular/core/testing';
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { MockTodoService } from 'src/testing/todo.service.mock';
import { AddTodoComponent } from './add-todo.component';
import { TodoProfileComponent } from './todo-profile.component';
import { TodoService } from './todo.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AddTodoComponent', () => {
  let addTodoComponent: AddTodoComponent;
  let addTodoForm: FormGroup;
  let fixture: ComponentFixture<AddTodoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.overrideProvider(TodoService, { useValue: new MockTodoService() });
    TestBed.configureTestingModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        AddTodoComponent
    ],
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTodoComponent);
    addTodoComponent = fixture.componentInstance;
    fixture.detectChanges();
    addTodoForm = addTodoComponent.addTodoForm;
    expect(addTodoForm).toBeDefined();
    expect(addTodoForm.controls).toBeDefined();
  });

  it('should create the component and form', () => {
    expect(addTodoComponent).toBeTruthy();
    expect(addTodoForm).toBeTruthy();
  });
  it('form should be invalid when empty', () => {
    expect(addTodoForm.valid).toBeFalsy();
  });

  describe('The owner field', () => {
    let ownerControl: AbstractControl;

    beforeEach(() => {
      ownerControl = addTodoComponent.addTodoForm.controls.owner;
    });

    it('should not allow empty names', () => {
      ownerControl.setValue('');
      expect(ownerControl.valid).toBeFalsy();
    });

    it('should be fine with "Chris Smith"', () => {
      ownerControl.setValue('Chris Smith');
      expect(ownerControl.valid).toBeTruthy();
    });

    it('should fail on single character names', () => {
      ownerControl.setValue('x');
      expect(ownerControl.valid).toBeFalsy();
      expect(ownerControl.hasError('minlength')).toBeTruthy();
    });

    it('should allow digits in the name', () => {
      ownerControl.setValue('Bad2Th3B0ne');
      expect(ownerControl.valid).toBeTruthy();
    });
  });

  describe('getErrorMessage()', () => {
    it('should return the correct error message', () => {
      // The type statement is needed to ensure that `controlName` isn't just any
      // random string, but rather one of the keys of the `addUserValidationMessages`
      // map in the component.
      const controlOwner: keyof typeof addTodoComponent.addTodoValidationMessages = 'owner';
      addTodoComponent.addTodoForm.get(controlOwner).setErrors({'required': true});
      expect(addTodoComponent.getErrorMessage(controlOwner)).toEqual('Owner name is required');

    });

    it('should return "Unknown error" if no error message is found', () => {
      // The type statement is needed to ensure that `controlName` isn't just any
      // random string, but rather one of the keys of the `addUserValidationMessages`
      // map in the component.
      const controlOwner: keyof typeof addTodoComponent.addTodoValidationMessages = 'owner';
      addTodoComponent.addTodoForm.get(controlOwner).setErrors({'unknown': true});
      expect(addTodoComponent.getErrorMessage(controlOwner)).toEqual('Unknown error');
    });
  })
});

describe('AddTodoComponent#submitForm()', () => {
  let component: AddTodoComponent;
  let fixture: ComponentFixture<AddTodoComponent>;
  let todoService: TodoService;
  let location: Location;

  beforeEach(() => {
    TestBed.overrideProvider(TodoService, { useValue: new MockTodoService() });
    TestBed.configureTestingModule({
    imports: [ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([
            { path: 'todos/1', component: TodoProfileComponent }
        ]),
        AddTodoComponent, TodoProfileComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTodoComponent);
    component = fixture.componentInstance;
    todoService = TestBed.inject(TodoService);
    location = TestBed.inject(Location);
    // We need to inject the router and the HttpTestingController, but
    // never need to use them. So, we can just inject them into the TestBed
    // and ignore the returned values.
    TestBed.inject(Router);
    TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  beforeEach(() => {
    component.addTodoForm.controls.owner.setValue('Owen');
    component.addTodoForm.controls.category.setValue('software design');
    component.addTodoForm.controls.body.setValue('wuhwuhwuh');
    component.addTodoForm.controls.status.setValue(false);
  });

  it('should call addTodo() and handle success response', fakeAsync(() => {
    fixture.ngZone.run(() => {
      const addTodoSpy = spyOn(todoService, 'addTodo').and.returnValue(of('1'));
      component.submitForm();
      expect(addTodoSpy).toHaveBeenCalledWith(component.addTodoForm.value);
      tick();
      expect(location.path()).toBe('/users/1');
      flush();
    });
  }));

  it('should call addTodo() and handle error response', () => {
    const path = location.path();
    const errorResponse = { status: 500, message: 'Server error' };
    const addTodoSpy = spyOn(todoService, 'addTodo')
      .and
      .returnValue(throwError(() => errorResponse));
    component.submitForm();
    expect(addTodoSpy).toHaveBeenCalledWith(component.addTodoForm.value);
    expect(location.path()).toBe(path);
  });
});

