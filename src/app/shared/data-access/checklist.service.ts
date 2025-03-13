import { computed, effect, inject, Injectable, signal } from '@angular/core';
import {
  AddChecklist,
  Checklist,
  EditChecklist,
} from '../interfaces/checklist';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StorageService } from './storage.service';

export interface ChecklistsState {
  checklists: Checklist[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  storageService = inject(StorageService);

  #state = signal<ChecklistsState>({
    checklists: [],
    loaded: false,
    error: null,
  });

  add$ = new Subject<AddChecklist>();
  delete$ = new Subject<Checklist['id']>();
  edit$ = new Subject<EditChecklist>();

  #checklistsLoaded$ = this.storageService.loadChecklists();
  checklists = computed(() => this.#state().checklists);
  loaded = computed(() => this.#state().loaded);

  constructor() {
    this.add$.pipe(takeUntilDestroyed()).subscribe(
      (checklist) =>
        checklist.title &&
        this.#state.update((state) => ({
          ...state,
          checklists: [...state.checklists, this.#addIdToChecklist(checklist)],
        }))
    );

    this.delete$.pipe(takeUntilDestroyed()).subscribe((id) =>
      this.#state.update((state) => ({
        ...state,
        checklists: [...state.checklists.filter((list) => list.id !== id)],
      }))
    );

    this.edit$.pipe(takeUntilDestroyed()).subscribe((checklist) => {
      console.log(checklist);
      this.#state.update((state) => ({
        ...state,
        checklists: state.checklists.map((list) =>
          list.id === checklist.id
            ? {
                ...list,
                title: checklist.data.title,
              }
            : list
        ),
      }));
    });

    this.#checklistsLoaded$.pipe(takeUntilDestroyed()).subscribe({
      next: (checklists) =>
        this.#state.update((state) => ({
          ...state,
          checklists,
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
        this.storageService.saveChecklists(this.checklists());
      }
    });
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
