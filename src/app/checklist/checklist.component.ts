import { Component, computed, effect, inject, signal } from '@angular/core';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ChecklistHeader } from './ui/checklist-header.component';
import { FormBuilder } from '@angular/forms';
import { ChecklistItem } from '../shared/interfaces/checklist-item';
import Modal from '../shared/ui/modal.component';
import FormModal from '../shared/ui/form-modal.component';
import { ChecklistItemService } from './data-access/checklist-item.service';
import { ChecklistItems } from './ui/checklist-items.component';

@Component({
  selector: 'app-checklist',
  template: `
    @if (checklist(); as checklist) {
    <app-checklist-header
      [checklist]="checklist"
      [checkedCount]="checkedCount()"
      (addItem)="checklistItemBeingEdited.set({})"
      (resetAll)="checklistItemService.resetChecklist$.next($event)"
    ></app-checklist-header>
    <app-checklist-items
      [items]="items()"
      (editItem)="checklistItemBeingEdited.set($event)"
      (toggleItem)="checklistItemService.toggle$.next($event)"
      (deleteItem)="checklistItemService.delete$.next($event)"
    />
    <app-modal [isOpen]="!!checklistItemBeingEdited()">
      <ng-template>
        <app-form-modal
          [formGroup]="checklistItemForm"
          [title]="checklistItemBeingEdited()?.title ?? 'Add checklist item'"
          (save)="
            checklistItemBeingEdited()?.id ? checklistItemService.edit$.next({
            data: {
              item: checklistItemForm.getRawValue(),
              checklistId: checklist.id,
            },
              id: checklistItemBeingEdited()?.id ?? ''
            }) :
            checklistItemService.add$.next({
              item: checklistItemForm.getRawValue(),
              checklistId: checklist.id,
            })
          "
          (close)="checklistItemBeingEdited.set(null)"
        ></app-form-modal>
      </ng-template>
    </app-modal>
    }
  `,
  imports: [ChecklistHeader, Modal, FormModal, ChecklistItems],
})
export default class ChecklistComponent {
  checklistService = inject(ChecklistService);
  checklistItemService = inject(ChecklistItemService);
  route = inject(ActivatedRoute);
  params = toSignal(this.route.paramMap);
  formBuilder = inject(FormBuilder);

  checklistItemForm = this.formBuilder.nonNullable.group({
    title: [''],
  });
  checklistItemBeingEdited = signal<Partial<ChecklistItem | null>>(null);

  checklist = computed(() =>
    this.checklistService
      .checklists()
      .find((c) => c.id === this.params()?.get('id'))
  );
  items = computed(() =>
    this.checklistItemService
      .checklistItems()
      .filter((c) => c.checklistId === this.params()?.get('id'))
  );
  checkedCount = computed(() => ({
    checked: this.items().filter((i) => i.checked).length,
    total: this.items().length,
  }));

  constructor() {
    effect(() => {
      if (!this.checklistItemBeingEdited()) {
        this.checklistItemForm.reset();
      } else {
        this.checklistItemForm
          .get('title')
          ?.setValue(this.checklistItemBeingEdited()?.title || '');
      }
    });
  }
}
