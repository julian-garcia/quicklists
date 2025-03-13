import { computed, effect, inject, Injectable, signal } from '@angular/core';
import {
  AddChecklistItem,
  ChecklistItem,
  EditChecklistItem,
} from '../../shared/interfaces/checklist-item';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Checklist } from '../../shared/interfaces/checklist';
import { StorageService } from '../../shared/data-access/storage.service';

export interface ChecklistItemsState {
  checklistItems: ChecklistItem[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistItemService {
  storageService = inject(StorageService);
  #state = signal<ChecklistItemsState>({
    checklistItems: [],
    loaded: false,
    error: null,
  });
  checklistItems = computed(() => this.#state().checklistItems);
  loaded = computed(() => this.#state().loaded);

  add$ = new Subject<AddChecklistItem>();
  edit$ = new Subject<EditChecklistItem>();
  toggle$ = new Subject<ChecklistItem>();
  delete$ = new Subject<ChecklistItem['id']>();
  resetChecklist$ = new Subject<Checklist['id']>();
  #checklistItemsLoaded$ = this.storageService.loadChecklistItems();

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

    this.edit$.pipe(takeUntilDestroyed()).subscribe((checklistItem) => {
      console.log(checklistItem);
      this.#state.update((state) => ({
        ...state,
        checklistItems: state.checklistItems.map((item) =>
          item.id === checklistItem.id
            ? {
                ...item,
                title: checklistItem.data.item.title,
              }
            : item
        ),
      }));
    });

    this.toggle$.pipe(takeUntilDestroyed()).subscribe((toggleItem) =>
      this.#state.update((state) => ({
        ...state,
        checklistItems: state.checklistItems.map((item) =>
          item.id === toggleItem.id &&
          item.checklistId === toggleItem.checklistId
            ? { ...item, checked: !item.checked }
            : item
        ),
      }))
    );

    this.delete$.pipe(takeUntilDestroyed()).subscribe((itemId) =>
      this.#state.update((state) => ({
        ...state,
        checklistItems: [
          ...state.checklistItems.filter((item) => item.id !== itemId),
        ],
      }))
    );

    this.resetChecklist$.pipe(takeUntilDestroyed()).subscribe((checklistId) =>
      this.#state.update((state) => ({
        ...state,
        checklistItems: [
          ...state.checklistItems.map((item) =>
            item.checklistId === checklistId
              ? { ...item, checked: false }
              : item
          ),
        ],
      }))
    );

    this.#checklistItemsLoaded$.pipe(takeUntilDestroyed()).subscribe({
      next: (checklistItems) =>
        this.#state.update((state) => ({
          ...state,
          checklistItems,
          loaded: true,
        })),
      error: (err) =>
        this.#state.update((state) => ({
          ...state,
          loaded: false,
          error: err,
        })),
    });

    effect(() => {
      if (this.loaded()) {
        this.storageService.saveChecklistItems(this.checklistItems());
      }
    });
  }
}
