import { Component } from '@angular/core';
import { DonVi } from '../../../models/don-vi.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { UnitService } from '../../../services/unit.service';

@Component({
  selector: 'app-unit-list',
  templateUrl: './unit-list.component.html',
  styleUrls: ['./unit-list.component.scss'],
})
export class UnitListComponent {
  donVis: DonVi[] = [];
  filtered: DonVi[] = [];
  paged: DonVi[] = [];

  khois: { id: number; name: string }[] = [];
  selectedKhoi: number | 'all' = 'all';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';

  currentPage = 1;
  itemsPerPage = 10;

  searchTerm = '';

  constructor(private donViService: UnitService, private alert: AlertService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.donViService.getAll().subscribe({
      next: (res) => {
        this.donVis = res;
        // Tạo danh sách khối (unique)
        const map = new Map<number, string>();
        res.forEach((d) => map.set(d.khoiId, d.khoiName));
        this.khois = Array.from(map.entries()).map(([id, name]) => ({
          id,
          name,
        }));

        this.applyFilter();
      },
      error: (err) => this.alert.error('Lỗi tải danh sách đơn vị'),
    });
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase();

    this.filtered = this.donVis.filter((d) => {
      const matchesSearch = d.donViName.toLowerCase().includes(term);
      const matchesKhoi = this.selectedKhoi === 'all' || d.khoiId === this.selectedKhoi;
      const matchesStatus =
        this.statusFilter === 'all' ||
        (this.statusFilter === 'active' && d.isActive) ||
        (this.statusFilter === 'inactive' && !d.isActive);

      return matchesSearch && matchesKhoi && matchesStatus;
    });

    this.setPage(1);
  }

  setPage(page: number) {
    this.currentPage = page;
    const start = (page - 1) * this.itemsPerPage;
    this.paged = this.filtered.slice(start, start + this.itemsPerPage);
  }
}
