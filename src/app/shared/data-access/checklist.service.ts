import {
  effect,
  inject,
  Injectable,
  linkedSignal,
  ResourceStatus,
} from '@angular/core';
import {
  AddChecklist,
  Checklist,
  EditChecklist,
} from '../interfaces/checklist';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  storageService = inject(StorageService);
  loadedChecklists = this.storageService.loadChecklists();

  add$ = new Subject<AddChecklist>();
  delete$ = new Subject<Checklist['id']>();
  edit$ = new Subject<EditChecklist>();

  checklists = linkedSignal({
    source: this.storageService.loadChecklists().value,
    computation: (checklists) => checklists ?? [],
  });

  constructor() {
    this.add$
      .pipe(takeUntilDestroyed())
      .subscribe(
        (checklist) =>
          checklist.title &&
          this.checklists.update((lists) => [
            ...lists,
            this.#addIdToChecklist(checklist),
          ])
      );

    this.delete$
      .pipe(takeUntilDestroyed())
      .subscribe((id) =>
        this.checklists.update((lists) => [
          ...lists.filter((list) => list.id !== id),
        ])
      );

    this.edit$
      .pipe(takeUntilDestroyed())
      .subscribe((checklist) =>
        this.checklists.update((lists) =>
          lists.map((list) =>
            list.id === checklist.id
              ? { ...checklist, title: checklist.data.title }
              : list
          )
        )
      );

    effect(() => {
      if (this.loadedChecklists.status() === ResourceStatus.Resolved) {
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
