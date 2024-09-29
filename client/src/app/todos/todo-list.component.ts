import { Component, signal, inject, computed, /*computed*/ } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, combineLatest, /*Observable,*/ of, switchMap, tap } from 'rxjs';
import { Todo } from './todo';
import { TodoService } from './todo.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { TodoCardComponent } from './todo-card.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { MatRadioModule } from '@angular/material/radio';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatPaginatorModule } from '@angular/material/paginator';
@Component({
  selector: 'app-todo-list-component',
  templateUrl: 'todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  providers: [],
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatRadioModule,
    TodoCardComponent,
    MatListModule,
    RouterLink,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatPaginatorModule,
  ],
})
export class TodoListComponent {
  private todoService = inject(TodoService);
  private snackBar = inject(MatSnackBar);

  todoOwner = signal<string | undefined>(undefined);
  todoStatus = signal<string | undefined>(undefined);
  todoCategory = signal<string | undefined>(undefined);
  todoBody = signal<string | undefined>(undefined);

  viewType = signal<'card' | 'list'>('list');

  errMsg = signal<string | undefined>(undefined);

  // We are doing status and owner filtering server side so these are observables
  private todoOwner$ = toObservable(this.todoOwner);
  private todoStatus$ = toObservable(this.todoStatus);

  myControl = new FormControl('');
  categories: string[] = ['Video Games','Homework','Groceries','Software design'];

  serverFilteredTodos =
    toSignal(
      combineLatest([this.todoOwner$, this.todoStatus$]).pipe(

      switchMap(([owner, status]) =>
        this.todoService.getTodos({
          owner,
          status,
        })
      ),
        catchError((err) => {
          if (err.error instanceof ErrorEvent) {
            this.errMsg.set(
              `Problem in the client – Error: ${err.error.message}`
            );
          } else {
            this.errMsg.set(
              `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`
            );
          }
          this.snackBar.open(this.errMsg(), 'OK', { duration: 6000 });
          // `catchError` needs to return the same type. `of` makes an observable of the same type, and makes the array still empty
          return of<Todo[]>([]);
        }),
        // Tap allows you to perform side effects if necessary
        tap(() => {
        })
      )
    );
  filteredTodos = computed(() => {
    const serverFilteredTodos = this.serverFilteredTodos();
    return this.todoService.filterTodos(serverFilteredTodos, {
      // owner: this.todoOwner(),
      // status: this.todoStatus(),
      body: this.todoBody(),
      category: this.todoCategory(),
    });
  });


}
