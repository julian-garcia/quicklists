import { Component, input, output } from '@angular/core';
import { Checklist } from '../../shared/interfaces/checklist';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checklist-list',
  template: `<ul>
    @for(list of checklists(); track list.id) {
    <li>
      <a routerLink="/checklist/{{ list.id }}">{{ list.title }}</a>
      <button (click)="editItem.emit(list)">Edit</button>
      <button (click)="deleteItem.emit(list.id)">Delete</button>
    </li>
    } @empty {
    <p>No lists</p>
    }
  </ul>`,
  imports: [RouterLink],
})
export class ChecklistListComponent {
  checklists = input.required<Checklist[]>();
  editItem = output<Checklist>();
  deleteItem = output<Checklist['id']>();
}
