import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-year-entry-actions',
  templateUrl: './year-entry-actions.component.html',
  styleUrls: ['./year-entry-actions.component.scss'],
})
export class YearEntryActionsComponent {
  @Input() canSave = false;
  @Input() dirty = false;
  @Output() save = new EventEmitter<void>();

  onSave() {
    this.save.emit();
  }
}
