import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SaveUser, UserList } from '../../../models/user.model';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

export interface DonViOption {
  id: number;
  name: string;
}
export interface RoleOption {
  id: string;
  name: string;
} // hoặc number nếu RoleId là số

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() user?: UserList;

  // ➜ THÊM 2 thuộc tính này để initialState gán được
  @Input() donViOptions: DonViOption[] = [];
  @Input() roles: RoleOption[] = [];
  @Input() existingUserNames: string[] = [];
  @Output() saved = new EventEmitter<SaveUser>();

  @ViewChild('userNameInput') userNameInput!: ElementRef;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public bsModalRef: BsModalRef,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      userName: [
        { value: this.user?.userName || '', disabled: this.mode === 'edit' },
        [Validators.required, Validators.minLength(5), Validators.maxLength(50), this.userNameExistsValidator()],
      ],
      fullName: [this.user?.fullName || '', Validators.required],
      donViId: [this.user?.donViId || null, Validators.required],
      roleIds: [this.user?.roles || []],
      isActive: [this.user?.isActive ?? true],
    });

    // TODO: load donVis, roles từ API
  }

  userNameExistsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const exists = this.existingUserNames.includes(control.value.toLowerCase());
      return exists ? { userNameExists: true } : null;
    };
  }

  ngAfterViewInit() {
    if (this.mode === 'create') {
      setTimeout(() => {
        this.userNameInput.nativeElement.focus();
      }, 0);
    }
  }

  onSubmit() {
    console.log(this.form.value);
    if (this.form.invalid) return;

    const value = this.form.getRawValue();

    const searchName = this.toUnsign(value.fullName).toLowerCase();

    if (this.mode === 'create') {
      const dto: SaveUser = {
        userName: value.userName,
        fullName: value.fullName,
        searchName,
        donViId: value.donViId,
        roleIds: value.roleIds,
        isActive: value.isActive,
      };
      this.saved.emit(dto);
    } else {
      const dto: SaveUser = {
        userId: this.user!.userId,
        userName: value.userName,
        fullName: value.fullName,
        searchName,
        donViId: value.donViId,
        roleIds: value.roleIds,
        isActive: value.isActive,
      };
      this.saved.emit(dto);
    }
  }

  onRoleChange(roleId: number, checked: boolean) {
    const current: number[] = this.form.controls['roleIds'].value || [];
    if (checked) {
      if (!current.includes(roleId)) {
        this.form.controls['roleIds'].setValue([...current, roleId]);
      }
    } else {
      this.form.controls['roleIds'].setValue(current.filter((id) => id !== roleId));
    }
  }
  private toUnsign(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // bỏ dấu
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }
}
