import {
  Component,
  contentChild,
  effect,
  inject,
  input,
  TemplateRef,
} from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-modal',
  template: ` <div></div> `,
})
export default class Modal {
  dialog = inject(Dialog);
  isOpen = input.required<boolean>();
  template = contentChild.required(TemplateRef);

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.dialog.open(this.template(), {
          panelClass: 'dialog-container',
          hasBackdrop: false,
        });
      } else {
        this.dialog.closeAll();
      }
    });
  }
}
