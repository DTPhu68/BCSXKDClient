import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, map } from 'rxjs';
import { SaveMonthRequest, MonthDetail } from 'src/app/shared/models/month-entry';
import { MonthResponse } from 'src/app/shared/models/month-entry/month-response.model';
import { MonthEntryService } from './month-entry.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ReportStatus } from 'src/app/shared/models';
import { getReportStatusText } from 'src/app/shared/utils';

@Injectable({
  providedIn: 'root',
})
export class MonthEntryFacade {
  private monthSubject = new BehaviorSubject<MonthResponse | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private dirtySubject = new BehaviorSubject<boolean>(false);

  /** Raw streams */
  month$ = this.monthSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  dirty$ = this.dirtySubject.asObservable();

  /** View streams */
  /** View streams */
  companyName$ = this.month$.pipe(map((m) => m?.donViName ?? ''));

  monthNumber$ = this.month$.pipe(map((m) => m?.thang ?? new Date().getMonth() + 1));

  year$ = this.month$.pipe(map((m) => m?.nam ?? new Date().getFullYear()));

  status$ = this.month$.pipe(map((m) => getReportStatusText(m?.status)));

  isEditable$ = this.month$.pipe(
    map((m) => m?.status === ReportStatus.New || m?.status === ReportStatus.Draft)
  );

  details$ = this.month$.pipe(map((m) => m?.monthItems ?? []));

  addToRelations$ = this.month$.pipe(map((m) => m?.chiTieuKhoiAddTos ?? []));

  constructor(private service: MonthEntryService, private authService: AuthService) {}

  // --- Load dữ liệu ---
  loadMonth(thang: number, nam: number) {
    const donViId = this.getDonViId(); // lấy từ auth.service hoặc store
     if (!donViId) return;

    this.loadingSubject.next(true);
    this.service
      .getMonth(donViId, nam, thang)
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe({
        next: (res) => {
          this.monthSubject.next(res);
          this.dirtySubject.next(false);
        },
        error: (err) => console.error('Load month failed', err),
      });
  }

  /** Lưu dữ liệu */
  saveMonth(request?: SaveMonthRequest) {
    const current = this.monthSubject.value;
    if (!current) return;

    const finalRequest: SaveMonthRequest = request ?? {
      headerId: current.headerId,
      monthItems: current.monthItems
    };

    this.loadingSubject.next(true);
    this.service.saveMonth(finalRequest)
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe({
        next: () => {
          this.dirtySubject.next(false);// ✅ reset về false

          // Nếu trạng thái trước đó là New thì chuyển sang Draft
          if (current.status === ReportStatus.New) {
            this.monthSubject.next({ ...current, status: ReportStatus.Draft });
          }
        },
        error: err => console.error('Save month failed', err)
      });
  }

 /** Update khi user nhập dữ liệu */
  updateDetails(details: MonthDetail[]) {
    const current = this.monthSubject.value;
    if (current) {
      this.monthSubject.next({
        ...current,
        monthItems: [...details]
      });
      this.markDirty();
    }
  }

  /** Đổi trạng thái (ví dụ khóa bảng) */
  changeStatus(headerId: number, status: ReportStatus) {
    this.service.changeStatus(headerId, status).subscribe({
      next: () => {
        const current = this.monthSubject.value;
        if (current) {
          this.monthSubject.next({ ...current, status });
        }
      },
      error: err => console.error('Change status failed', err)
    });
  }

  /** Mark form đang dirty */
  markDirty() {
    this.dirtySubject.next(true);
  }


  // --- Lấy donViId từ auth (tùy bạn triển khai) ---
  private getDonViId(): number {    
    return this.authService.getDonViId() || 0;
  }
}
