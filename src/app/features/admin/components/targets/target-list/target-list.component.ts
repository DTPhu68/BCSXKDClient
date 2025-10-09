import { Component } from '@angular/core';
import { TargetService } from '../../../services/target.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { LookupService } from 'src/app/shared/services/lookup.service';
import { Target } from '../../../models/target.model';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TargetAddfromFormComponent } from '../target-addfrom-form/target-addfrom-form.component';

@Component({
  selector: 'app-target-list',
  templateUrl: './target-list.component.html',
  styleUrls: ['./target-list.component.scss'],
})
export class TargetListComponent {
  khois: { id: number; name: string }[] = [];
  selectedKhoi: number | null = null;

  targets: Target[] = [];
  filtered: Target[] = [];

  searchTerm = '';

  constructor(
    private targetService: TargetService,
    private alert: AlertService,
    private modalService: BsModalService,
    private lookupService: LookupService // nếu có service cho Khoi
  ) {}

  ngOnInit(): void {
    this.loadKhois();
  }

  loadKhois() {
    this.lookupService.getKhoiLookup().subscribe({
      next: (res) => {
        this.khois = res
          .filter((x: any) => x.khoiId > 0)
          .map((x: any) => ({ id: x.khoiId, name: x.khoiName }));
      },
      error: (err) => this.alert.error('Lỗi tải danh sách khối'),
    });
  }

  onKhoiChange() {
    if (!this.selectedKhoi) {
      this.targets = [];
      return;
    }

    this.targetService.getByKhoi(this.selectedKhoi).subscribe({
      next: (res) => {
        this.targets = res;
        this.applyFilter();
      },
      error: (err) => this.alert.error('Lỗi tải chỉ tiêu'),
    });
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase();

    this.filtered = this.targets.filter((t) => t.chiTieuName.toLowerCase().includes(term));
  }

  openAddFromForm(t: Target) {
    const leafTargets = this.targets.filter((x) => x.leafNode && x.id !== t.id);

    const bsModalRef = this.modalService.show(TargetAddfromFormComponent, {
      initialState: {
        parentTarget: t,
        leafTargets, // ✅ truyền sẵn
      },
      class: 'modal-lg',
    });

    (bsModalRef.content as TargetAddfromFormComponent).saved.subscribe(() => {
      this.onKhoiChange(); // reload danh sách sau khi lưu
    });
  }
}
