import { Component, effect, inject, signal } from '@angular/core';
import Modal from '../shared/ui/modal.component';
import { Checklist } from '../shared/interfaces/checklist';
import { FormBuilder } from '@angular/forms';
import FormModal from '../shared/ui/form-modal.component';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { ChecklistListComponent } from './ui/checklist-list.component';

@Component({
  selector: 'app-home',
  template: `<header>
      <h1>Quicklists</h1>
      <button (click)="checklistBeingEdited.set({})">Add Checklist</button>
    </header>
    <app-modal [isOpen]="!!checklistBeingEdited()">
      <ng-template>
        <app-form-modal
          [formGroup]="checklistForm"
          [title]="checklistBeingEdited()?.title ?? 'Add checklist'"
          (save)="
            checklistBeingEdited()?.id
              ? checklistService.edit$.next({
                  id: checklistBeingEdited()?.id ?? '',
                  data: checklistForm.getRawValue()
                })
              : checklistService.add$.next(checklistForm.getRawValue())
          "
          (close)="checklistBeingEdited.set(null)"
        ></app-form-modal>
      </ng-template>
    </app-modal>
    <app-checklist-list
      [checklists]="checklistService.checklists()"
      (editItem)="checklistBeingEdited.set($event)"
      (deleteItem)="checklistService.delete$.next($event)"
    ></app-checklist-list>`,
  imports: [Modal, FormModal, ChecklistListComponent],
})
export default class HomeComponent {
  checklistBeingEdited = signal<Partial<Checklist | null>>(null);
  formBuilder = inject(FormBuilder);
  checklistForm = this.formBuilder.nonNullable.group({ title: [''] });
  checklistService = inject(ChecklistService);

  constructor() {
    effect(() => {
      if (this.checklistBeingEdited() === null) {
        this.checklistForm.reset();
      } else {
        this.checklistForm
          .get('title')
          ?.setValue(this.checklistBeingEdited()?.title ?? '');
      }
    });
  }
}
