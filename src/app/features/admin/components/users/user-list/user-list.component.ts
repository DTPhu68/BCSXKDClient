import { Component } from '@angular/core';
import { UserList } from '../../../models/user.model';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from 'src/app/core/services/alert.service';
import { UserService } from '../../../services/user.service';
import { UserFormComponent } from '../user-form/user-form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
  users: UserList[] = [];
  filteredUsers: UserList[] = [];
  pagedUsers: UserList[] = [];

  roles = [
    { id: 'Admin', name: 'Admin' },
    { id: 'NhapLieu', name: 'Nhập liệu' },
    { id: 'BaoCao', name: 'Báo cáo' },
    { id: 'ToanNganh', name: 'Toàn ngành' },
  ];
  searchTerm = '';
  statusFilter: string = 'all'; // all | active | inactive

  currentPage = 1;
  itemsPerPage = 8;

  sortColumn: string = '';
  sortAsc: boolean = true;

  constructor(
    private userService: UserService,
    private modalService: BsModalService,
    private alertService: AlertService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filter();
      },
      error: () => this.alertService.error('Lỗi tải danh sách người dùng'),
    });
  }

  filter() {
    const term = this.searchTerm.toLowerCase();

    this.filteredUsers = this.users.filter((u) => {
      const matchesSearch =
        u.fullName.toLowerCase().includes(term) || u.userName.toLowerCase().includes(term);

      const matchesStatus =
        this.statusFilter === 'all' ||
        (this.statusFilter === 'active' && u.isActive) ||
        (this.statusFilter === 'inactive' && !u.isActive);

      return matchesSearch && matchesStatus;
    });

    this.setPage(1);
  }
  setPage(page: number) {
    this.currentPage = page;
    const start = (page - 1) * this.itemsPerPage;
    this.pagedUsers = this.sortedUsers.slice(start, start + this.itemsPerPage);
  }
  setSort(col: string) {
    if (this.sortColumn === col) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortColumn = col;
      this.sortAsc = true;
    }
    this.setPage(1);
  }

  getSortIcon(col: string): string {
    if (this.sortColumn !== col) return 'fas fa-sort';
    return this.sortAsc ? 'fas fa-sort-up' : 'fas fa-sort-down';
  }

  get sortedUsers() {
    const users = [...this.filteredUsers];
    if (!this.sortColumn) return users;

    return users.sort((a: any, b: any) => {
      let valA = a[this.sortColumn];
      let valB = b[this.sortColumn];

      if (Array.isArray(valA)) valA = valA.join(', ');
      if (Array.isArray(valB)) valB = valB.join(', ');

      valA = valA?.toString().toLowerCase() || '';
      valB = valB?.toString().toLowerCase() || '';

      if (valA < valB) return this.sortAsc ? -1 : 1;
      if (valA > valB) return this.sortAsc ? 1 : -1;
      return 0;
    });
  }

  openCreateUserModal() {
    const initialState: Partial<UserFormComponent> = {
      mode: 'create',
      donViOptions: this.getDonViOptions(),
      roles: this.roles, // giả sử bạn có mảng roles load sẵn
      existingUserNames: this.users.map((u) => u.userName.toLowerCase()), // ✅ truyền vào đây
    };

    const bsModalRef = this.modalService.show(UserFormComponent, {
      initialState,
      class: 'modal-lg',
    });

    const formComp = bsModalRef.content as UserFormComponent;
    formComp.saved.subscribe((dto) => {
      this.userService.addUser(dto).subscribe({
        next: () => {
          this.toastr.success('Tạo người dùng thành công');
          this.loadUsers();
          bsModalRef.hide();
        },
        error: () => this.alertService.error('Tạo người dùng thất bại'),
      });
    });
  }

  openEditUserModal(user: UserList) {
    const initialState: Partial<UserFormComponent> = {
      mode: 'edit',
      user,
      donViOptions: this.getDonViOptions(),
      roles: this.roles,
    };

    const bsModalRef = this.modalService.show(UserFormComponent, {
      initialState,
      class: 'modal-lg',
    });

    const formComp = bsModalRef.content as UserFormComponent;
    formComp.saved.subscribe((dto) => {
      this.userService.updateUser(user.userId, dto).subscribe({
        next: () => {
          this.toastr.success('Cập nhật người dùng thành công');
          this.loadUsers();
          bsModalRef.hide();
        },
        error: () => this.alertService.error('Cập nhật người dùng thất bại'),
      });
    });
  }

  getDonViOptions() {
    const map = new Map<number, string>();
    this.users.forEach((u) => map.set(u.donViId, u.donViName));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }

  get donViOptions() {
    const map = new Map<number, string>();
    this.users.forEach((u) => map.set(u.donViId, u.donViName));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }

  toggleActive(user: UserList) {
    const action = user.isActive ? 'Vô hiệu hóa' : 'Kích hoạt';

    Swal.fire({
      title: `${action} người dùng?`,
      text: `${user.fullName} (${user.userName})`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: action,
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.toggleActive(user.userId, !user.isActive).subscribe({
          next: () => {
            user.isActive = !user.isActive; // update ngay trên client
            this.toastr.success(`${action} thành công`);
          },
          error: () => this.toastr.error(`${action} thất bại`),
        });
      }
    });
  }

  deleteUser(user: UserList) {
    if (user.isActive) {
      this.toastr.warning('Phải vô hiệu hoá trước khi xoá');
      return;
    }

    Swal.fire({
      title: `Xoá người dùng?`,
      text: `${user.fullName} (${user.userName})`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xoá',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(user.userId).subscribe({
          next: () => {
            // Cập nhật UI: xoá ngay khỏi mảng
            this.users = this.users.filter((u) => u.userId !== user.userId);
            this.filteredUsers = this.filteredUsers.filter((u) => u.userId !== user.userId);
            this.pagedUsers = this.pagedUsers.filter((u) => u.userId !== user.userId);
            this.toastr.success('Xoá người dùng thành công');
          },
          error: () => this.toastr.error('Xoá người dùng thất bại'),
        });
      }
    });
  }

  resetPassword(user: UserList) {
    Swal.fire({
      title: `Đặt lại mật khẩu?`,
      text: `Mật khẩu sẽ được reset về Username cho ${user.fullName} (${user.userName})`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Reset',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.resetPassword(user.userId).subscribe({
          next: () => {
            this.toastr.success(`Đặt lại mật khẩu cho ${user.userName} thành công`);
          },
          error: () => {
            this.toastr.error('Reset mật khẩu thất bại');
          },
        });
      }
    });
  }
}
