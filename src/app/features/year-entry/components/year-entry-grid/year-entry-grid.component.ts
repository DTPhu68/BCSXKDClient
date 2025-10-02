import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ChiTieuKhoiAddTo } from 'src/app/shared/models/chi-tieu-khoi-add-to.model';
import { YearDetail } from 'src/app/shared/models/year-entry';

@Component({
  selector: 'app-year-entry-grid',
  templateUrl: './year-entry-grid.component.html',
  styleUrls: ['./year-entry-grid.component.scss'],
})
export class YearEntryGridComponent implements OnInit {
  @Input() details: YearDetail[] = [];
  @Input() addToRelations: ChiTieuKhoiAddTo[] = [];
  @Input() editable = false;

  @Output() detailChange = new EventEmitter<YearDetail[]>();
  @Output() save = new EventEmitter<void>(); // 👈 thêm event Save

  // LƯU Ý: thêm { read: ElementRef } để ViewChildren trả về ElementRef
  @ViewChildren('cellInput', { read: ElementRef })
  cellInputs!: QueryList<ElementRef<HTMLInputElement>>;

  activeElement?: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    // console.log('addToRelations:', this.addToRelations);
    // console.log('details:', this.details);
  }

  //#region Khi thay đổi giá trị một ô
  onCellChange(detail: YearDetail, field: keyof Pick<YearDetail, 'planValue'>, value: number) {
    const newValue = Number(value ?? 0);

    // luôn cập nhật model (để hiển thị đúng số)
    detail[field] = newValue;

    // cập nhật cộng dồn ngay lập tức để bảng hiển thị chuẩn
    if (detail.leafNode) {
      this.updateAddToValues(detail, field);
    }
  }

  private updateAddToValues(changedLeaf: YearDetail, field: keyof Pick<YearDetail, 'planValue'>) {
    const fromId = changedLeaf.chiTieuId;
    const targets = this.addToRelations.filter((r) => r.fromId === fromId).map((r) => r.toId);

    for (const toId of targets) {
      const sum = this.details
        .filter((d) => this.addToRelations.some((r) => r.toId === toId && r.fromId === d.chiTieuId))
        .reduce((acc, curr) => acc + (curr[field] || 0), 0);

      const target = this.details.find((d) => d.chiTieuId === toId);
      if (target) target[field] = sum;
    }
  }
  //#endregion

  private beforeEditValue: number | null = null;
  onFocus(event: FocusEvent, isLeaf: boolean, detail?: YearDetail, field?: 'planValue') {
    const input = event.target as HTMLInputElement;

    // Nếu là non-leaf (readonly) và focus đến từ chuột -> blur lại ngay
    if (!isLeaf && (event as any).detail > 0) {
      input.blur();
      return;
    }

    // Nếu là leaf thì nhớ lại giá trị cũ + auto select
    if (isLeaf && detail && field) {
      this.beforeEditValue = detail[field] ?? 0;
      setTimeout(() => input.select(), 0);
    }
  }

  onBlur(event: FocusEvent, detail: YearDetail, field: 'planValue') {
    const newValue = detail[field] ?? 0;
    if (this.beforeEditValue !== null && this.beforeEditValue !== newValue) {
      if (detail.leafNode) {
        this.updateAddToValues(detail, field);
      }
      this.detailChange.emit(this.details);
    }
    this.beforeEditValue = null;
  }
  //#region  Điều hướng phím mũi tên
  onKeyDown(event: KeyboardEvent, rowIndex: number, colIndex: number) {
    const inputs = this.cellInputs.toArray();
    const cols = 1; // chỉ có planValue
    const idx = rowIndex * cols + colIndex;
    let targetIdx = idx;
    let handled = true;

    if (event.ctrlKey) {
      switch (event.key) {
        case 'ArrowDown':
          targetIdx = this.findLastInColumn(colIndex, cols, inputs) ?? idx;
          break;
        case 'ArrowUp':
          targetIdx = this.findFirstInColumn(colIndex, cols, inputs) ?? idx;
          break;
        default:
          handled = false;
      }
    } else {
      switch (event.key) {
        case 'ArrowDown':
          targetIdx = idx + cols;
          break;
        case 'ArrowUp':
          targetIdx = idx - cols;
          break;
        case 'Enter':
          targetIdx = event.shiftKey ? idx - cols : idx + cols;
          break;
        case 'Tab':
          targetIdx = event.shiftKey ? idx - 1 : idx + 1;
          break;
        default:
          handled = false;
      }
    }

    if (handled) {
      while (targetIdx >= 0 && targetIdx < inputs.length) {
        const el = inputs[targetIdx]?.nativeElement;
        if (el && !el.readOnly) {
          event.preventDefault();
          el.focus();
          break;
        }

        // nhảy tiếp cùng hướng
        if (['Tab'].includes(event.key) && !event.shiftKey) targetIdx++;
        else if (event.key === 'Tab' && event.shiftKey) targetIdx--;
        else if (['ArrowDown', 'Enter'].includes(event.key) && !event.shiftKey) targetIdx += cols;
        else if (event.key === 'ArrowUp' || (event.key === 'Enter' && event.shiftKey))
          targetIdx -= cols;
        else break;
      }
    }
  }
  /** Tìm ô nhập liệu đầu tiên trong cột */
  private findFirstInColumn(
    colIndex: number,
    cols: number,
    inputs: ElementRef<HTMLInputElement>[]
  ): number | null {
    let targetIdx = colIndex; // hàng 0
    while (targetIdx < inputs.length) {
      const el = inputs[targetIdx]?.nativeElement;
      if (el && !el.readOnly) return targetIdx;
      targetIdx += cols; // xuống hàng kế tiếp
    }
    return null;
  }

  /** Tìm ô nhập liệu cuối cùng trong cột */
  private findLastInColumn(
    colIndex: number,
    cols: number,
    inputs: ElementRef<HTMLInputElement>[]
  ): number | null {
    let targetIdx = (this.details.length - 1) * cols + colIndex; // hàng cuối
    while (targetIdx >= 0) {
      const el = inputs[targetIdx]?.nativeElement;
      if (el && !el.readOnly) return targetIdx;
      targetIdx -= cols; // lên hàng trước
    }
    return null;
  }

  //#endregion

  /** Lắng nghe Ctrl+S toàn cục */
  @HostListener('window:keydown', ['$event'])
  handleGlobalKeydown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
      event.preventDefault();
      this.save.emit();
    }
  }
  /** CSS class cho ô input */
  getInputClass(editable: boolean, leaf: boolean): string {
    if (!editable || !leaf) return 'bg-light';
    return 'bg-warning-subtle';
  }

  /** CSS class theo level */
  getRowClass(level: number): string {
    switch (level) {
      case 0:
        return 'level-0';
      case 1:
        return 'level-1';
      case 2:
        return 'level-2';
      default:
        return 'level-3';
    }
  }

  /** Tính indent cho chỉ tiêu */
  getIndent(level: number): string {
    return `${level * 20}px`; // mỗi level thụt 20px
  }
}
