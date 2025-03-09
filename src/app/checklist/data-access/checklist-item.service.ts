import { computed, Injectable, signal } from '@angular/core';
import {
  AddChecklistItem,
  ChecklistItem,
} from '../../shared/interfaces/checklist-item';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface ChecklistItemsState {
  checklistItems: ChecklistItem[];
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistItemService {
  #state = signal<ChecklistItemsState>({ checklistItems: [] });
  checklistItems = computed(() => this.#state().checklistItems);
  add$ = new Subject<AddChecklistItem>();
  toggle$ = new Subject<ChecklistItem>();

  constructor() {
    this.add$.pipe(takeUntilDestroyed()).subscribe((checklistItem) =>
      this.#state.update((state) => ({
        ...state,
        checklistItems: [
          ...state.checklistItems,
          {
            ...checklistItem.item,
            id: Date.now().toString(),
            checklistId: checklistItem.checklistId,
            checked: false,
          },
        ],
      }))
    );

    this.toggle$.pipe(takeUntilDestroyed()).subscribe((toggleItem) =>
      this.#state.update((state) => ({
        ...state,
        checklistItems: [
          ...state.checklistItems.map((item) =>
            item.id === toggleItem.id &&
            item.checklistId === toggleItem.checklistId
              ? { ...item, checked: !item.checked }
              : item
          ),
        ],
      }))
    );
  }
}
