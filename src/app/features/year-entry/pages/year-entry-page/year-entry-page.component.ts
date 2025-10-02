import { Component } from '@angular/core';
import { YearEntryFacade } from '../../services/year-entry.facade';
import { ActivatedRoute } from '@angular/router';
import { YearDetail } from 'src/app/shared/models/year-entry';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-year-entry-page',
  templateUrl: './year-entry-page.component.html',
  styleUrls: ['./year-entry-page.component.scss'],
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
export class YearEntryPageComponent {
  years = Array.from({ length: 15 }, (_, i) => 2018 + i);
  year = new Date().getFullYear();
  loading = false;
  khoiId: number = 0;

  constructor(public facade: YearEntryFacade, private route: ActivatedRoute) {}

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
      this.facade.loadYear(this.year);
      this.loading = false;
    }, 500);
  }

  onYearChange(y: number): void {
    this.year = +y;
    this.loadData();
  }

  onDetailChange(updatedDetails: YearDetail[]) {
    this.facade.updateYearItems(updatedDetails);
  }

  onSave() {
    this.facade.saveYear();
  }
}
