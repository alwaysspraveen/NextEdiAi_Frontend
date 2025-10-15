import { CommonModule } from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';
import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  OnInit,
  Output,
  NgZone,
} from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  showStatusPanel: boolean = false;

  ngOnInit() {
    this.loadData();
  }

  name: string = '';
  role: string = '';
  email: string = '';
  profileImg: string = 'assets/icons/user.svg';
  fname: string = '';
  dateValue = new Date();
  userId: string | null = null;
  userRole: string | null = null;
  total_notify = 0;
  showNotificationPanel = true;
  status: string = ''; // Default status

  dropdownOpen = false;
  unreadCount = 0;

  loadData() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      this.userId = user.id || user._id;
      this.name = user.name;
      this.email = user.email;
      this.fname = user.fname;
      this.role = user.role;
      this.userRole = user.role;
      this.status = user.status;
    }
  }
}
