import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-change-pwd-modal',
  templateUrl: './change-pwd-modal.component.html',
  styleUrls: ['./change-pwd-modal.component.scss']
})
export class ChangePwdModalComponent {
loading = false;

  form = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [
      Validators.required,
      Validators.minLength(4),
      // this.passwordPolicy()
    ]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.matchPasswords('newPassword', 'confirmPassword') });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private alert: AlertService,
    public modalRef: BsModalRef
  ) {}

  get f() { return this.form.controls; }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const { currentPassword, newPassword } = this.form.value;

    this.auth.changePassword({
      currentPassword: currentPassword!,
      newPassword: newPassword!
    }).subscribe({
      next: () => {
        this.alert.success('Đổi mật khẩu thành công');
        this.modalRef.hide();
      },
      error: (err) => {
        if (err?.status === 400) {
          this.alert.error(err.error?.message || 'Mật khẩu hiện tại không đúng');
        } else {
          this.alert.error('Đổi mật khẩu thất bại');
        }
      },
      complete: () => this.loading = false
    });
  }

  close() {
    this.modalRef.hide();
  }

  private matchPasswords(pw: string, cf: string) {
    return (group: AbstractControl): ValidationErrors | null => {
      const pwCtrl = group.get(pw);
      const cfCtrl = group.get(cf);
      if (!pwCtrl || !cfCtrl) return null;
      return pwCtrl.value === cfCtrl.value ? null : { passwordMismatch: true };
    };
  }

  private passwordPolicy() {
    // tối thiểu 1 chữ hoa, 1 chữ thường, 1 số (bạn chỉnh theo policy của bạn)
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    return (c: AbstractControl): ValidationErrors | null =>
      c.value && !regex.test(c.value) ? { weakPassword: true } : null;
  }
}
