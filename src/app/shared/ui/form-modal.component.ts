import { KeyValuePipe, TitleCasePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-modal',
  template: ` <header>
      <div class="header-content">
        <h2>{{ title() }}</h2>
        <button (click)="close.emit()">close</button>
      </div>
    </header>
    <section>
      <form [formGroup]="formGroup()" (ngSubmit)="save.emit(); close.emit()">
        @for (control of formGroup().controls | keyvalue; track control.key){
        <div>
          <label [for]="control.key">{{ control.key | titlecase }}</label>
          <input
            [id]="control.key"
            type="text"
            [formControlName]="control.key"
          />
        </div>
        }
        <button type="submit">Save</button>
      </form>
    </section>`,
  imports: [ReactiveFormsModule, KeyValuePipe, TitleCasePipe],
  styles: [
    `
      form {
        display: flex;
        gap: 1rem;
        align-items: center;
      }
      label {
        margin-right: 1rem;
      }
      input {
        padding: 6px;
      }
    `,
  ],
})
export default class FormModal {
  formGroup = input.required<FormGroup>();
  title = input.required<string>();
  save = output();
  close = output();
}
