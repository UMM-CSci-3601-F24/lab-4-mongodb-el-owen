import { Component, input } from '@angular/core';
import { Todo } from './todo';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';


@Component({
    selector: 'app-todo-card',
    templateUrl: './todo-card.component.html',
    styleUrls: ['./todo-card.component.scss'],
    standalone: true,
    imports: [MatCardModule, MatButtonModule, MatListModule, MatIconModule, RouterLink]
})
export class TodoCardComponent {
  todo = input.required<Todo>();
  simple = input(false);
}
