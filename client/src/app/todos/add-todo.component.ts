import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TodoService } from './todo.service';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-add-todo',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule],
  templateUrl: './add-todo.component.html',
  styleUrl: './add-todo.component.scss'
})
export class AddTodoComponent {
  addTodoForm = new FormGroup({
    owner: new FormControl('',Validators.compose([
      Validators.required,
      Validators.minLength(0),
      // (fc) => {
      //   if (fc.value.toLowerCase() === 'abc123' || fc.value.toLowerCase() === '123abc') {
      //     return ({existingOwner: true});
      //   } else {
      //     return null;
      //   }
      // },
    ])),
    category: new FormControl('', Validators.compose([
      Validators.required,
    ])),
    body: new FormControl('', Validators.compose([
      Validators.required,
    ])),
    // status: new FormControl<boolean>(null, Validators.compose([
    //   Validators.required,
    // ])),
  });

  readonly addTodoValidationMessages = {
    owner: [
      {type: 'required', message: 'Owner name is required'},
      {type: 'minlength', message: 'Name must be at least 1 character long'},
      // {type: 'maxlength', message: 'Name cannot be more than 50 characters long'},
      // {type: 'existingName', message: 'Name has already been taken'}
    ],

    category: [
      {type: 'required', message: 'category is required'},
      // {type: 'min', message: 'Age must be at least 15'},
      // {type: 'max', message: 'Age may not be greater than 200'},
      // {type: 'pattern', message: 'Age must be a whole number'}
    ],

    body: [
      {type: 'required', message: 'Body is required'},
      {type: 'minlength', message: 'Body must be at least 1 character long'},
    ],
    // status: [
    //   { type: 'required', message: 'Status is required' },
    //   { type: 'pattern', message: 'Role must be a boolean' },
    // ]
  };

  constructor(
    private todoService: TodoService,
    private snackBar: MatSnackBar,
    private router: Router) {
  }

  formControlHasError(controlOwner: string): boolean {
    return this.addTodoForm.get(controlOwner).invalid &&
      (this.addTodoForm.get(controlOwner).dirty || this.addTodoForm.get(controlOwner).touched);
  }

  getErrorMessage(owner: keyof typeof this.addTodoValidationMessages): string {
    for(const {type, message} of this.addTodoValidationMessages[owner]) {
      if (this.addTodoForm.get(owner).hasError(type)) {
        return message;
      }
    }
    return 'Unknown error';
  }

  submitForm() {
    this.todoService.addTodo(this.addTodoForm.value).subscribe({
      next: (newId) => {
        this.snackBar.open(
          `Added todo ${this.addTodoForm.value.owner}`,
          null,
          { duration: 2000 }
        );
        this.router.navigate(['/todos/', newId]);
      },
      error: err => {
        this.snackBar.open(
          `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`,
          'OK',
          { duration: 5000 }
        );
      },
    });
  }

}
