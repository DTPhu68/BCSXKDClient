import { Component } from '@angular/core';
import { MonthEntryFacade } from '../../services/month-entry.facade';
import { MonthDetail } from 'src/app/shared/models/month-entry/month-detail.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-month-entry-page',
  templateUrl: './month-entry-page.component.html',
  styleUrls: ['./month-entry-page.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class MonthEntryPageComponent {
  months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  years = Array.from({ length: 15 }, (_, i) => 2018 + i);

  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();
  loading = false;
  khoiId: number = 0;
 lastSavedTime: Date | null = null;
  dirty = false;

  constructor(public facade: MonthEntryFacade, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const khoiIdParam = params.get('khoiId');
      this.khoiId = khoiIdParam ? +khoiIdParam : 0;
      //this.facade.setKhoiId(this.khoiId);
      this.loadData();
    });
    //this.loadData();
  }

  loadData() {
    this.loading = true;
    setTimeout(() => {
      this.facade.loadMonth(this.month, this.year);
      this.loading = false;
    }, 500);
  }

  onMonthChange(m: number): void {
    this.month = +m;
    this.loadData();
  }

  onYearChange(y: number): void {
    this.year = +y;
    this.loadData();
  }

  onDetailChange(updatedDetails: MonthDetail[]) {
     this.dirty = true;
    this.facade.updateDetails(updatedDetails);
  }
 

  markDirty() {
    this.dirty = true;
  }
  onSave() {
    this.facade.saveMonth();
    this.dirty = false;
    this.lastSavedTime = new Date();
     // Ẩn sau 3 giây (tùy bạn)
    //setTimeout(() => (this.lastSavedTime = null), 3000);
  }
}
