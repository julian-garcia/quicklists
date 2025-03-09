import { Component, input } from '@angular/core';
import { Checklist } from '../../shared/interfaces/checklist';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checklist-list',
  template: `<ul>
    @for(list of checklists(); track list.id) {
    <li>
      <a routerLink="/checklist/{{ list.id }}">{{ list.title }}</a>
    </li>
    } @empty {
    <p>No lists</p>
    }
  </ul>`,
  imports: [RouterLink],
})
export class ChecklistListComponent {
  checklists = input.required<Checklist[]>();
}
