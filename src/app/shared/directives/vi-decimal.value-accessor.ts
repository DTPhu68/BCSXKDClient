// shared/directives/vi-decimal.value-accessor.ts
import { Directive, ElementRef, forwardRef, HostListener, Renderer2, Input } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: 'input[appViDecimal]',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ViDecimalValueAccessor), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => ViDecimalValueAccessor), multi: true }
  ]  
})
export class ViDecimalValueAccessor implements ControlValueAccessor, Validator {
  /** cấu hình */
  @Input('appViDecimalMaxFractionDigits') maxFractionDigits = 4;  // số lẻ tối đa
  @Input('appViDecimalMin') min?: number;                         // min
  @Input('appViDecimalMax') max?: number;                         // max

  private onChange: (val: number | null) => void = () => {};
  private onTouched: () => void = () => {};
  private onValidatorChange: () => void = () => {};
  private nf = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 20 });

  constructor(private el: ElementRef<HTMLInputElement>, private rd: Renderer2) {}

  // CVA
  writeValue(value: number | null): void {
    const s = (value ?? null) === null ? '' : this.formatVi(value!);
    this.rd.setProperty(this.el.nativeElement, 'value', s);
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.rd.setProperty(this.el.nativeElement, 'disabled', disabled); }

  // VALIDATOR
  validate(_: AbstractControl): ValidationErrors | null {
    const num = this.parseViDecimal(this.el.nativeElement.value);
    if (num === null) return null;
    if (this.min !== undefined && num < this.min) return { min: { min: this.min, actual: num } };
    if (this.max !== undefined && num > this.max) return { max: { max: this.max, actual: num } };
    // kiểm tra số lẻ
    const frac = this.fractionLength(num);
    if (this.maxFractionDigits >= 0 && frac > this.maxFractionDigits) {
      return { maxFractionDigits: { max: this.maxFractionDigits, actual: frac } };
    }
    return null;
  }
  registerOnValidatorChange(fn: () => void): void { this.onValidatorChange = fn; }

  /** 1) Gõ '.' (kể cả NumpadDecimal) -> chèn ',' như Excel */
  @HostListener('keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    if (e.key === '.' || e.code === 'NumpadDecimal') {
      e.preventDefault();
      this.insertAtSelection(',');
      return;
    }
    // chặn nhiều dấu ',' (chỉ cho phép 1 cái)
    if (e.key === ',' && this.el.nativeElement.value.includes(',')) {
      // cho phép nếu đang ghi đè dấu ',' hiện tại
      const inp = this.el.nativeElement;
      const start = inp.selectionStart ?? 0, end = inp.selectionEnd ?? 0;
      if (!(start !== end && inp.value.slice(start, end).includes(','))) e.preventDefault();
    }
  }

  /** 2) Input: parse + ràng số lẻ tối đa (không auto format nghìn để tránh nhảy con trỏ) */
  @HostListener('input', ['$event'])
  onInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const limited = this.enforceFractionLimit(input.value, this.maxFractionDigits);
    if (limited !== input.value) {
      const caret = (input.selectionStart ?? limited.length);
      this.rd.setProperty(input, 'value', limited);
      queueMicrotask(() => input.setSelectionRange(caret, caret));
    }
    this.propagateFromView(input.value);
    this.onValidatorChange();
  }

  /** 3) Paste: chuẩn hoá chuỗi (nhận mọi biến thể, quyết định dấu thập phân theo ký tự phân cách cuối cùng) */
  @HostListener('paste', ['$event'])
  onPaste(e: ClipboardEvent) {
    const data = e.clipboardData?.getData('text') ?? '';
    if (!data) return;
    e.preventDefault();
    const coerced = this.coerceToViView(data);
    this.insertAtSelection(coerced);
    this.propagateFromView(this.el.nativeElement.value);
    this.onValidatorChange();
  }

  /** 4) Focus: select-all */
  @HostListener('focus')
  onFocus() {
    const inp = this.el.nativeElement;
    queueMicrotask(() => inp.setSelectionRange(0, inp.value.length));
  }

  /** 5) Blur: clamp min/max + format đẹp theo vi-VN + làm tròn theo maxFractionDigits */
  @HostListener('blur')
  onBlur() {
    this.onTouched();
    const input = this.el.nativeElement;
    let num = this.parseViDecimal(input.value);
    if (num !== null) {
      if (this.min !== undefined && num < this.min) num = this.min;
      if (this.max !== undefined && num > this.max) num = this.max;
      // làm tròn theo số lẻ tối đa
      if (this.maxFractionDigits >= 0) {
        const pow = Math.pow(10, this.maxFractionDigits);
        num = Math.round(num * pow) / pow;
      }
    }
    const display = (num === null) ? '' : this.formatVi(num);
    this.rd.setProperty(input, 'value', display);
    this.onChange(num);
  }

  // ===== helpers =====
  private insertAtSelection(text: string) {
    const input = this.el.nativeElement;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    const newVal = input.value.slice(0, start) + text + input.value.slice(end);
    this.rd.setProperty(input, 'value', newVal);
    queueMicrotask(() => input.setSelectionRange(start + text.length, start + text.length));
  }

  private fractionLength(n: number): number {
    const s = String(n);
    const i = s.indexOf('.');
    return i < 0 ? 0 : s.length - i - 1;
  }

  /** parse chuỗi vi-VN -> number */
  private parseViDecimal(viewValue: string): number | null {
    if (!viewValue) return null;
    const normalized = viewValue.replace(/\./g, '').replace(',', '.').trim();
    if (normalized === '' || normalized === '-' || normalized === '.') return null;
    const num = Number(normalized);
    return Number.isFinite(num) ? num : null;
  }

  /** format number -> chuỗi vi-VN, tôn trọng maxFractionDigits */
  private formatVi(n: number): string {
    return new Intl.NumberFormat('vi-VN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: this.maxFractionDigits
    }).format(n);
  }

  /** cắt bớt phần lẻ vượt quá maxFractionDigits trong chuỗi view (dùng ',' làm dấu thập phân) */
  private enforceFractionLimit(view: string, maxFrac: number): string {
    if (maxFrac < 0) return view;
    const i = view.indexOf(',');
    if (i < 0) return view;
    const frac = view.slice(i + 1);
    if (frac.length <= maxFrac) return view;
    return view.slice(0, i + 1 + maxFrac);
  }

  /** Chuẩn hoá text bất kỳ sang view vi-VN: dấu thập phân là ',' */
  private coerceToViView(raw: string): string {
    const s = raw.replace(/\s/g, '').replace(/’/g, "'"); // bỏ khoảng trắng lẻ
    const lastDot = s.lastIndexOf('.');
    const lastComma = s.lastIndexOf(',');
    const lastSep = Math.max(lastDot, lastComma);

    // Lấy toàn bộ chữ số + dấu ngăn cách, xác định dấu thập phân là sep cuối
    const digits = s.replace(/[^0-9.,-]/g, '');

    if (lastSep === -1) {
      // không có sep ⇒ chỉ số nguyên (có thể có dấu -)
      return digits.replace(/[.,]/g, '');
    }

    // tách phần nguyên & lẻ theo sep cuối
    const integerPart = digits.slice(0, lastSep).replace(/[.,]/g, '');
    const fracPart = digits.slice(lastSep + 1).replace(/[.,]/g, '');
    const sign = digits.trim().startsWith('-') ? '-' : '';

    const merged = sign + integerPart.replace(/^-/, '') + (fracPart ? (',' + fracPart) : '');
    return this.enforceFractionLimit(merged, this.maxFractionDigits);
  }

  private propagateFromView(viewValue: string) {
    const num = this.parseViDecimal(viewValue);
    this.onChange(num);
  }
}
