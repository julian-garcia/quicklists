import { computed, Injectable, signal } from '@angular/core';
import { AddChecklist, Checklist } from '../interfaces/checklist';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface ChecklistsState {
  checklists: Checklist[];
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  #state = signal<ChecklistsState>({
    checklists: [],
  });

  checklists = computed(() => this.#state().checklists);

  add$ = new Subject<AddChecklist>();

  constructor() {
    this.add$.pipe(takeUntilDestroyed()).subscribe((checklist) =>
      checklist.title && this.#state.update((state) => ({
        ...state,
        checklists: [...state.checklists, this.#addIdToChecklist(checklist)],
      }))
    );
  }

  #addIdToChecklist(checklist: AddChecklist): Checklist {
    return {
      ...checklist,
      id:
        checklist.title
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/gi, '')
          .toLowerCase() + Date.now().toString(),
    };
  }

}
