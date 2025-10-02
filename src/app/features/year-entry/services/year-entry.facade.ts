import { Injectable } from '@angular/core';
import { YearEntryService } from './year-entry.service';
import { BehaviorSubject, finalize, map } from 'rxjs';
import { SaveYearRequest, YearResponse } from 'src/app/shared/models/year-entry';
import { ReportStatus } from 'src/app/shared/models';
import { getReportStatusText } from 'src/app/shared/utils';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class YearEntryFacade {
  private yearSubject = new BehaviorSubject<YearResponse | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private dirtySubject = new BehaviorSubject<boolean>(false);

  /** Raw streams */
  year$ = this.yearSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  dirty$ = this.dirtySubject.asObservable();

  /** View streams */
  companyName$ = this.year$.pipe(map((y) => y?.donViName ?? ''));
  yearNumber$ = this.year$.pipe(map((y) => y?.nam ?? new Date().getFullYear()));
  status$ = this.year$.pipe(map((y) => getReportStatusText(y?.status)));
  isEditable$ = this.year$.pipe(
    map((y) => y?.status === ReportStatus.New || y?.status === ReportStatus.Draft)
  );
  details$ = this.year$.pipe(map((y) => y?.yearItems ?? []));

  addToRelations$ = this.year$.pipe(map((y) => y?.chiTieuKhoiAddTos ?? []));
  
  constructor(private yearEntryService: YearEntryService, private authService: AuthService) {}

  // --- Load dữ liệu ---
  loadYear(nam: number) {
    const donViId = this.getDonViId(); // lấy từ auth.service hoặc store
    if (!donViId) return;

    this.loadingSubject.next(true);
    this.yearEntryService
      .getYear(donViId, nam)
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe({
        next: (res) => {
          this.yearSubject.next(res);
          this.dirtySubject.next(false);
        },
        error: (err) => console.error('Load year failed', err),
      });
  }
  // --- Lưu dữ liệu ---
  saveYear(request?: SaveYearRequest) {
    const current = this.yearSubject.value;
    if (!current) return;
    const saveRequest: SaveYearRequest = request ?? {
      headerId: current.headerId,
      yearItems: current.yearItems,
    };

    this.loadingSubject.next(true);
    this.yearEntryService
      .saveYear(saveRequest)
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe({
        next: () => {
          this.dirtySubject.next(false); // reset về false
          // Nếu trạng thái trước đó là New thì chuyển sang Draft
          if (current.status === ReportStatus.New) {
            this.yearSubject.next({ ...current, status: ReportStatus.Draft });
          }
        },
        error: (err) => console.error('Save year failed', err),
      });
  }

  /** Update khi user nhập dữ liệu */
  updateYearItems(items: YearResponse['yearItems']) {
    const current = this.yearSubject.value;
    if (!current) return;
    this.yearSubject.next({ ...current, yearItems: items });
    this.dirtySubject.next(true);
  }

  /** Đổi trạng thái (ví dụ khóa bảng) */
  changeStatus(newStatus: ReportStatus) {
    const current = this.yearSubject.value;
    if (!current) return;
    this.yearSubject.next({ ...current, status: newStatus });
  }
  
  markDirty() { 
    this.dirtySubject.next(true);
  }

  // --- Lấy donViId từ auth (tùy bạn triển khai) ---
  private getDonViId(): number {
    return this.authService.getDonViId() || 0;
  }
}
