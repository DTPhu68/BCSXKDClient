import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Target } from '../../../models/target.model';
import { TargetService } from '../../../services/target.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-target-addfrom-form',
  templateUrl: './target-addfrom-form.component.html',
  styleUrls: ['./target-addfrom-form.component.scss'],
})
export class TargetAddfromFormComponent {
 @Input() parentTarget!: Target;
  @Input() leafTargets: Target[] = [];   // ✅ nhận sẵn từ list
  @Output() saved = new EventEmitter<void>();

  selectedIds: Set<number> = new Set();

  constructor(
    private targetService: TargetService,
    private alert: AlertService,
    private modalRef: BsModalRef
  ) {}

  ngOnInit(): void {
    this.initializeSelection();
  }

  initializeSelection() {
    if (this.parentTarget.addFromList) {
      this.parentTarget.addFromList.forEach((a) => this.selectedIds.add(a.id));
    }
  }

  toggleSelection(id: number) {
    this.selectedIds.has(id)
      ? this.selectedIds.delete(id)
      : this.selectedIds.add(id);
  }

  save() {
    const ids = Array.from(this.selectedIds);
    this.targetService.updateAddFrom(this.parentTarget.id, ids).subscribe({
      next: () => {
        this.alert.success('Cập nhật thành công');
        this.saved.emit();
        this.modalRef.hide();
      },
      error: () => this.alert.error('Cập nhật thất bại'),
    });
  }

  close() {
    this.modalRef.hide();
  }


}
