import { Component, input, output } from '@angular/core';
import { ChecklistItem } from '../../shared/interfaces/checklist-item';

@Component({
  selector: 'app-checklist-items',
  template: `<ul>
    @for (item of items(); track item.id) {
    <li>
      <div>
        <input
          type="checkbox"
          [id]="item.id"
          [checked]="item.checked"
          (change)="toggleItem.emit(item)"
        />
        <label [for]="item.id">{{ item.title }}</label>
      </div>
      <div>
        <button (click)="editItem.emit(item)">Edit</button>
        <button (click)="deleteItem.emit(item.id)">Delete</button>
      </div>
    </li>
    } @empty {
    <div style="padding: 1rem 2rem 2rem">
      <h2>Add an item</h2>
      <p>Click the add button to add your first item to this quicklist</p>
    </div>
    }
  </ul>`,
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
export class ChecklistItems {
  readonly items = input.required<ChecklistItem[]>();
  toggleItem = output<ChecklistItem>();
  editItem = output<ChecklistItem>();
  deleteItem = output<ChecklistItem['id']>();
}
