import { Component, input, output } from '@angular/core';
import { Checklist } from '../../shared/interfaces/checklist';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checklist-header',
  template: `<header>
    <button routerLink="/home">Back</button>
    <button (click)="addItem.emit()">Add item</button>
    <h1>{{ checklist().title }}</h1>
  </header>`,
  imports: [RouterLink],
})
export class ChecklistHeader {
  checklist = input.required<Checklist>();
  addItem = output()
}
