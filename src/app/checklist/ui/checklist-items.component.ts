import { Component, input, output } from '@angular/core';
import { ChecklistItem } from '../../shared/interfaces/checklist-item';

@Component({
  selector: 'app-checklist-items',
  template: `<ul>
    @for (item of items(); track item.id) {
    <li>
      <input
        type="checkbox"
        [id]="item.id"
        [checked]="item.checked"
        (change)="toggleItem.emit(item)"
      />
      <label [for]="item.id">{{ item.title }}</label>
    </li>
    } @empty {
    <div>
      <h2>Add an item</h2>
      <p>Click the add button to add your first item to this quicklist</p>
    </div>
    }
  </ul>`,
})
export class ChecklistItems {
  readonly items = input.required<ChecklistItem[]>();
  toggleItem = output<ChecklistItem>();
}
