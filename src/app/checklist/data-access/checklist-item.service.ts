import {
  effect,
  inject,
  Injectable,
  linkedSignal,
  ResourceStatus,
} from '@angular/core';
import {
  AddChecklistItem,
  ChecklistItem,
  EditChecklistItem,
} from '../../shared/interfaces/checklist-item';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Checklist } from '../../shared/interfaces/checklist';
import { StorageService } from '../../shared/data-access/storage.service';

@Injectable({
  providedIn: 'root',
})
export class ChecklistItemService {
  storageService = inject(StorageService);
  loadedChecklistItems = this.storageService.loadChecklistItems();

  checklistItems = linkedSignal({
    source: this.storageService.loadChecklistItems().value,
    computation: (checklistItems) => checklistItems ?? [],
  });

  add$ = new Subject<AddChecklistItem>();
  edit$ = new Subject<EditChecklistItem>();
  toggle$ = new Subject<ChecklistItem>();
  delete$ = new Subject<ChecklistItem['id']>();
  checklistRemoved$ = new Subject<Checklist['id']>();
  resetChecklist$ = new Subject<Checklist['id']>();

  constructor() {
    this.add$.pipe(takeUntilDestroyed()).subscribe((checklistItem) =>
      this.checklistItems.update((items) => [
        ...items,
        {
          ...checklistItem.item,
          id: Date.now().toString(),
          checklistId: checklistItem.checklistId,
          checked: false,
        },
      ])
    );

    this.edit$.pipe(takeUntilDestroyed()).subscribe((checklistItem) =>
      this.checklistItems.update((items) =>
        items.map((item) =>
          item.id === checklistItem.id
            ? {
                ...item,
                title: checklistItem.data.item.title,
              }
            : item
        )
      )
    );

    this.toggle$
      .pipe(takeUntilDestroyed())
      .subscribe((toggleItem) =>
        this.checklistItems.update((items) =>
          items.map((item) =>
            item.id === toggleItem.id &&
            item.checklistId === toggleItem.checklistId
              ? { ...item, checked: !item.checked }
              : item
          )
        )
      );

    this.delete$
      .pipe(takeUntilDestroyed())
      .subscribe((itemId) =>
        this.checklistItems.update((items) =>
          items.filter((item) => item.id !== itemId)
        )
      );

    this.checklistRemoved$
      .pipe(takeUntilDestroyed())
      .subscribe((listId) =>
        this.checklistItems.update((items) =>
          items.filter((item) => item.checklistId !== listId)
        )
      );

    this.resetChecklist$
      .pipe(takeUntilDestroyed())
      .subscribe((checklistId) =>
        this.checklistItems.update((items) =>
          items.map((item) =>
            item.checklistId === checklistId
              ? { ...item, checked: false }
              : item
          )
        )
      );

    effect(() => {
      if (this.loadedChecklistItems.status() === ResourceStatus.Resolved) {
        this.storageService.saveChecklistItems(this.checklistItems());
      }
    });
  }
}
