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
  </header>`,
  imports: [RouterLink],
  styles: [
    `
      button {
        margin-left: 1rem;
      }
    `,
  ],
})
export class ChecklistHeader {
  checklist = input.required<Checklist>();
  addItem = output();
  resetAll = output<Checklist['id']>();
}
