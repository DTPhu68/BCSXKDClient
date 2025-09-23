import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-month-entry-actions',
  templateUrl: './month-entry-actions.component.html',
  styleUrls: ['./month-entry-actions.component.scss'],
})
export class MonthEntryActionsComponent {
  @Input() canSave = false;
    @Input() dirty = false;
  @Output() save = new EventEmitter<void>();

  onSave() {
    this.save.emit();
  }
}
