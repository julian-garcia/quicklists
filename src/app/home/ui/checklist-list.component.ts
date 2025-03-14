import { Component, input, output } from '@angular/core';
import { Checklist } from '../../shared/interfaces/checklist';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checklist-list',
  template: `<ul>
    @for(list of checklists(); track list.id) {
    <li>
      <a routerLink="/checklist/{{ list.id }}">{{ list.title }}</a>
      <div>
        <button (click)="editItem.emit(list)">Edit</button>
        <button (click)="deleteItem.emit(list.id)">Delete</button>
      </div>
    </li>
    } @empty {
    <p>No lists</p>
    }
  </ul>`,
  imports: [RouterLink],
  styles: [
    `
      ul {
        padding: 0 0 2rem;
        margin: 0;
        background: var(--color-light);
      }
      li {
        font-size: 1.5em;
        display: flex;
        justify-content: space-between;
        list-style-type: none;
        margin-bottom: 1rem;
        padding: 1rem 2rem 0;
        max-width: 600px;

        button {
          margin-left: 1rem;
        }
      }
    `,
  ],
})
export class ChecklistListComponent {
  checklists = input.required<Checklist[]>();
  editItem = output<Checklist>();
  deleteItem = output<Checklist['id']>();
}
