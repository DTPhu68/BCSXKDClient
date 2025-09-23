import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ChiTieuKhoiAddTo } from 'src/app/shared/models/month-entry/chi-tieu-khoi-add-to.model';
import { MonthDetail } from 'src/app/shared/models/month-entry/month-detail.model';

@Component({
  selector: 'app-month-entry-grid',
  templateUrl: './month-entry-grid.component.html',
  styleUrls: ['./month-entry-grid.component.scss'],
})
export class MonthEntryGridComponent {
  @Input() details: MonthDetail[] = [];
  @Input() addToRelations: ChiTieuKhoiAddTo[] = [];
  @Input() editable = false;

  @Output() detailChange = new EventEmitter<MonthDetail[]>();
  @Output() save = new EventEmitter<void>(); // 👈 thêm event Save

  @ViewChildren('cellInput') cellInputs!: QueryList<ElementRef<HTMLInputElement>>;

  activeElement?: ElementRef<HTMLInputElement>;
  /** Khi thay đổi giá trị một ô */
  onCellChange(
    detail: MonthDetail,
    field: keyof Pick<MonthDetail, 'planValue' | 'actualValue'>,
    value: number
  ) {
    detail[field] = value || 0;

    if (detail.leafNode) {
      this.updateAddToValues(detail, field);
    }

    // Emit full list để facade cập nhật
    this.detailChange.emit(this.details);
  }

  private updateAddToValues(
    changedLeaf: MonthDetail,
    field: keyof Pick<MonthDetail, 'planValue' | 'actualValue'>
  ) {
    const fromId = changedLeaf.chiTieuId;

    // Lấy các chỉ tiêu cần cộng dồn vào (toId)
    const targets = this.addToRelations.filter((r) => r.fromId === fromId).map((r) => r.toId);

    for (const toId of targets) {
      const sum = this.details
        .filter((d) => this.addToRelations.some((r) => r.toId === toId && r.fromId === d.chiTieuId))
        .reduce((acc, curr) => acc + (curr[field] || 0), 0);

      const target = this.details.find((d) => d.chiTieuId === toId);
      if (target) target[field] = sum;
    }
  }

  onFocus(event: FocusEvent) {
    // const input = event.target as HTMLInputElement;
    // setTimeout(() => input.select(), 0);
    const input = event.target as HTMLInputElement;
    this.activeElement = this.cellInputs.find((ref) => ref.nativeElement === input);
    setTimeout(() => input.select(), 0);
  }

  /** Điều hướng phím mũi tên */
  onKeyDown(event: KeyboardEvent, rowIndex: number, colIndex: number) {
    const inputs = this.cellInputs.toArray();
    const cols = 2; // chỉ có plan + actual
    const idx = rowIndex * cols + colIndex;
    let targetIdx = idx;
    let handled = true;

    // Ctrl + Arrow (nhảy nhanh)
    if (event.ctrlKey) {
      switch (event.key) {
        case 'ArrowRight':
          targetIdx = rowIndex * cols + (cols - 1); // cuối hàng
          break;
        case 'ArrowLeft':
          targetIdx = rowIndex * cols; // đầu hàng
          break;
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
      // Bình thường
      switch (event.key) {
        case 'ArrowRight':
          targetIdx = idx + 1;
          break;
        case 'ArrowLeft':
          targetIdx = idx - 1;
          break;
        case 'ArrowDown':
          targetIdx = idx + cols;
          break;
        case 'ArrowUp':
          targetIdx = idx - cols;
          break;
        case 'Tab':
          targetIdx = event.shiftKey ? idx - 1 : idx + 1;
          break;
        case 'Enter':
          targetIdx = event.shiftKey ? idx - cols : idx + cols;
          break;
        default:
          handled = false;
      }
    }

    if (handled) {
      // tìm ô nhập hợp lệ
      while (targetIdx >= 0 && targetIdx < inputs.length) {
        const el = inputs[targetIdx]?.nativeElement;
        if (el && !el.readOnly) {
          event.preventDefault();
          el.focus();
          break;
        }

        // nhảy tiếp cùng hướng
        if (['ArrowRight', 'Tab'].includes(event.key) && !event.shiftKey) targetIdx++;
        else if (['ArrowLeft'].includes(event.key) || (event.key === 'Tab' && event.shiftKey))
          targetIdx--;
        else if (['ArrowDown', 'Enter'].includes(event.key) && !event.shiftKey) targetIdx += cols;
        else if (['ArrowUp'].includes(event.key) || (event.key === 'Enter' && event.shiftKey))
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
