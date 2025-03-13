import { inject, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core';
import { Checklist } from '../interfaces/checklist';
import { ChecklistItem } from '../interfaces/checklist-item';
import { of } from 'rxjs';

export const LOCAL_STORAGE = new InjectionToken<Storage>('', {
  providedIn: 'root',
  factory: () => {
    return inject(PLATFORM_ID) === 'browser'
      ? window.localStorage
      : ({} as Storage);
  },
});

@Injectable({ providedIn: 'root' })
export class StorageService {
  storage = inject(LOCAL_STORAGE);

  saveChecklists(checklists: Checklist[]) {
    this.storage.setItem('checklists', JSON.stringify(checklists));
  }

  saveChecklistItems(checklistItems: ChecklistItem[]) {
    this.storage.setItem('checklistItems', JSON.stringify(checklistItems));
  }

  loadChecklists() {
    const checklists = this.storage.getItem('checklists') ?? '[]';
    return of(JSON.parse(checklists) as Checklist[]);
  }

  loadChecklistItems() {
    const checklistItems = this.storage.getItem('checklistItems') ?? '[]';
    return of(JSON.parse(checklistItems) as ChecklistItem[]);
  }
}
