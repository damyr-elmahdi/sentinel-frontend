import { Component, signal, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent, SidebarItem } from '../../shared/sidebar/sidebar';

@Pipe({ name: 'titleFor', standalone: true })
export class TitleForPipe implements PipeTransform {
  transform(items: SidebarItem[], id: string): string {
    return items.find(i => i.id === id)?.label ?? '';
  }
}

@Pipe({ name: 'pendingCount', standalone: true })
export class PendingCountPipe implements PipeTransform {
  transform(tasks: any[]): number { return tasks.filter(t => !t.done).length; }
}

@Pipe({ name: 'unreadCount', standalone: true })
export class UnreadCountPipe implements PipeTransform {
  transform(msgs: any[]): number { return msgs.filter(m => !m.read).length; }
}

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TitleForPipe, PendingCountPipe, UnreadCountPipe],
  templateUrl: './employee-dashboard.html',
  styleUrl: './employee-dashboard.css'
})
export class EmployeeDashboardComponent {
  activeSection = signal('schedule');

  navItems: SidebarItem[] = [
    { id: 'schedule', label: 'Time Schedule', icon: '📅' },
    { id: 'register', label: 'Time Register', icon: '⏱️' },
    { id: 'tasks',    label: 'Task List',     icon: '✅' },
    { id: 'inbox',   label: 'Inbox',          icon: '📬' },
    { id: 'profile', label: 'Profile',        icon: '👤' },
  ];

  today = new Date();
  currentMonth = this.today.getMonth();
  currentYear = this.today.getFullYear();
  weekDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  shifts = [
    { date: new Date(2025, 4, 19), time: '08:00 – 16:00', zone: 'Zone A — Main Entrance' },
    { date: new Date(2025, 4, 22), time: '16:00 – 00:00', zone: 'Zone B — Server Room' },
    { date: new Date(2025, 4, 26), time: '08:00 – 16:00', zone: 'Zone C — Parking Level 2' },
    { date: new Date(2025, 5, 2),  time: '00:00 – 08:00', zone: 'Zone A — Main Entrance' },
    { date: new Date(2025, 5, 6),  time: '08:00 – 16:00', zone: 'Zone D — Rooftop Access' },
  ];

  get calendarDays(): (number | null)[] {
    const first = new Date(this.currentYear, this.currentMonth, 1);
    const last  = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startDay = (first.getDay() + 6) % 7;
    const days: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let d = 1; d <= last.getDate(); d++) days.push(d);
    return days;
  }

  hasShift(day: number | null) {
    if (!day) return false;
    return this.shifts.some(s => s.date.getDate() === day && s.date.getMonth() === this.currentMonth && s.date.getFullYear() === this.currentYear);
  }
  isToday(day: number | null) {
    if (!day) return false;
    return day === this.today.getDate() && this.currentMonth === this.today.getMonth() && this.currentYear === this.today.getFullYear();
  }
  prevMonth() { if (this.currentMonth === 0) { this.currentMonth = 11; this.currentYear--; } else this.currentMonth--; }
  nextMonth() { if (this.currentMonth === 11) { this.currentMonth = 0; this.currentYear++; } else this.currentMonth++; }

  clockedIn = signal(false);
  clockInTime = signal<string | null>(null);
  elapsed = signal('00:00:00');
  private _timer: any = null;

  clockIn() {
    this.clockedIn.set(true);
    this.clockInTime.set(new Date().toLocaleTimeString());
    const start = Date.now();
    this._timer = setInterval(() => {
      const sec = Math.floor((Date.now() - start) / 1000);
      const h = Math.floor(sec / 3600).toString().padStart(2,'0');
      const m = Math.floor((sec % 3600) / 60).toString().padStart(2,'0');
      const s = (sec % 60).toString().padStart(2,'0');
      this.elapsed.set(`${h}:${m}:${s}`);
    }, 1000);
  }
  clockOut() {
    clearInterval(this._timer);
    this.timeLog.unshift({ date: new Date().toLocaleDateString(), clockIn: this.clockInTime()!, clockOut: new Date().toLocaleTimeString(), hours: this.elapsed() });
    this.clockedIn.set(false); this.clockInTime.set(null); this.elapsed.set('00:00:00');
  }

  timeLog: { date: string; clockIn: string; clockOut: string; hours: string }[] = [
    { date: '05/12/2025', clockIn: '08:02', clockOut: '16:04', hours: '08:02:00' },
    { date: '05/10/2025', clockIn: '07:58', clockOut: '16:01', hours: '08:03:00' },
    { date: '05/08/2025', clockIn: '08:10', clockOut: '16:08', hours: '07:58:00' },
  ];

  tasks = [
    { id: 1, text: 'Inspect fire sensor at Zone B entrance', priority: 'HIGH', done: false },
    { id: 2, text: 'Log RFID badge reads from morning shift', priority: 'MEDIUM', done: false },
    { id: 3, text: 'Submit incident report — parking camera offline', priority: 'HIGH', done: false },
    { id: 4, text: 'Verify servo lock on server room door', priority: 'MEDIUM', done: true },
    { id: 5, text: 'Update emergency contact list', priority: 'LOW', done: true },
  ];
  newTask = '';

  addTask() { if (!this.newTask.trim()) return; this.tasks.unshift({ id: Date.now(), text: this.newTask.trim(), priority: 'MEDIUM', done: false }); this.newTask = ''; }
  toggleTask(t: any) { t.done = !t.done; }
  deleteTask(id: number) { this.tasks = this.tasks.filter(t => t.id !== id); }
  priorityStyle(p: string) {
    return p === 'HIGH' ? { background: '#fee2e2', color: '#dc2626' } :
           p === 'MEDIUM' ? { background: '#fef3c7', color: '#d97706' } :
           { background: '#dbeafe', color: '#1e40af' };
  }

  selectedMsg = signal<any | null>(null);
  messages = [
    { id: 1, from: 'Admin — Operations', subject: 'Shift change notice: 19 May', body: 'Your shift on May 19th has been updated to 06:00–14:00. Please confirm receipt and adjust your schedule accordingly. Failure to confirm within 24h will be noted.', time: '09:41', date: 'Today', read: false, tag: 'URGENT' },
    { id: 2, from: 'System Alert', subject: 'Water sensor triggered — Zone C', body: 'The water presence sensor at Zone C (Floor 2, utility corridor) was triggered at 03:22. Maintenance has been notified. Please verify the area during your next patrol.', time: 'Yesterday', date: 'Yesterday', read: true, tag: 'ALERT' },
    { id: 3, from: 'HR Department', subject: 'Monthly report reminder', body: 'This is a reminder to submit your monthly activity report by the end of this week. Please use the standard template and send it to hr@sentinel.io.', time: '2d ago', date: '2 days ago', read: true, tag: 'INFO' },
    { id: 4, from: 'Admin — Security', subject: 'New RFID badge policy effective June 1', body: 'Starting June 1, all employee RFID badges must be re-registered in the new system. Please visit the security office before May 30.', time: '3d ago', date: '3 days ago', read: true, tag: 'INFO' },
  ];
  openMsg(m: any) { m.read = true; this.selectedMsg.set(m); }
  closeMsg() { this.selectedMsg.set(null); }
  msgTagStyle(tag: string) {
    return tag === 'URGENT' ? { background: '#fee2e2', color: '#dc2626' } :
           tag === 'ALERT'  ? { background: '#fef3c7', color: '#d97706' } :
           { background: '#dbeafe', color: '#1e40af' };
  }

  profile: Record<string, string> = {
    name: 'John Doe', username: 'john.doe', email: 'john.doe@sentinel.io',
    phone: '+1 555 012 3456', department: 'Physical Security',
    role: 'Security Officer', badge: 'EMP-0042', joined: 'March 2024'
  };
  getField(key: string): string { return this.profile[key] ?? ''; }
  setField(key: string, val: string) { this.profile[key] = val; }
  profileFields = [
    { label: 'FULL NAME',   key: 'name',       editable: true  },
    { label: 'USERNAME',    key: 'username',    editable: true  },
    { label: 'EMAIL',       key: 'email',       editable: true  },
    { label: 'PHONE',       key: 'phone',       editable: true  },
    { label: 'DEPARTMENT',  key: 'department',  editable: false },
    { label: 'ROLE',        key: 'role',        editable: false },
    { label: 'BADGE ID',    key: 'badge',       editable: false },
    { label: 'JOINED',      key: 'joined',      editable: false },
  ];
  editingProfile = signal(false);
}
