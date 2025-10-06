import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  success(message: string, title: string = 'Thành công') {
    Swal.fire({
      icon: 'success',
      title,
      text: message,
      timer: 1500,
      showConfirmButton: false,
    });
  }

  error(message: any, title: string = 'Lỗi') {
    if (typeof message === 'string') {
      Swal.fire('Lỗi', message, 'error');
    } else if (message?.message) {
      Swal.fire('Lỗi', message.message, 'error');
    } else {
      Swal.fire('Lỗi', JSON.stringify(message), 'error');
    }
  }

  info(message: string, title: string = 'Thông tin') {
    Swal.fire({
      icon: 'info',
      title,
      text: message,
    });
  }

  async confirm(
    message: string,
    title: string = 'Xác nhận',
    confirmText: string = 'Đồng ý',
    cancelText: string = 'Huỷ'
  ): Promise<boolean> {
    const result = await Swal.fire({
      title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });
    return result.isConfirmed;
  }
}
