import { Checklist } from './checklist';

export interface ChecklistItem {
  id: string;
  checklistId: Checklist['id'];
  title: string;
  checked: boolean;
}

export type AddChecklistItem = {
  item: { title: ChecklistItem['title'] };
  checklistId: Checklist['id'];
};

export type EditChecklistItem = {
  id: ChecklistItem['id'];
  data: AddChecklistItem;
};
