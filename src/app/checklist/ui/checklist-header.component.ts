import { Component, input, output } from '@angular/core';
import { Checklist } from '../../shared/interfaces/checklist';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checklist-header',
  template: `<header>
    <div class="header-content">
      <h1>{{ checklist().title }}</h1>
      <div>
        <button routerLink="/home">Back</button>
        <button (click)="addItem.emit()">Add item</button>
        <button (click)="resetAll.emit(checklist().id)">Clear</button>
      </div>
    </div>
    @if (checkedCount().total === 0) {
    <p>Nothing to see here... 😐</p>
    } @else if (checkedCount().checked === 0) {
    <p>Get a wriggle on! 😴</p>
    } @else if (checkedCount().checked === checkedCount().total) {
    <p>You've done it all 👍</p>
    } @else {
    <p>
      Getting there... {{ checkedCount().checked }} of
      {{ checkedCount().total }} 🙂‍
    </p>
    }
  </header>`,
  imports: [RouterLink],
  styles: [
    `
      button {
        margin-left: 1rem;
      }
      p {
        margin: 0 2rem;
        padding: 0 0 1rem;
      }
    `,
  ],
})
export class ChecklistHeader {
  checklist = input.required<Checklist>();
  checkedCount = input.required<{ checked: number; total: number }>();
  addItem = output();
  resetAll = output<Checklist['id']>();
}
