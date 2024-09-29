import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TodoService } from './todo.service';
import { of, Subject } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TodoCardComponent } from './todo-card.component';

import { MatCardModule } from '@angular/material/card';
// import { MatIcon } from '@angular/material/icon';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-todo-profile',
  standalone: true,
  imports: [TodoCardComponent, MatCardModule],
  templateUrl: './todo-profile.component.html',
  styleUrl: './todo-profile.component.scss'
})
export class TodoProfileComponent {
  private snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);
  private todoService = inject(TodoService);

  todo = toSignal(
    this.route.paramMap.pipe(
      map((paramMap: ParamMap) => paramMap.get('id')),
      switchMap((id: string) => this.todoService.getTodoById(id)),
      catchError((_err) => {
        this.error.set({
          help: 'There was a problem loading the user – try again.',
          httpResponse: _err.message,
          message: _err.error?.title,
        });
        return of();
      })
    )
  );
  error = signal({ help: '', httpResponse: '', message: '' });
  private ngUnsubscribe = new Subject<void>();
}
