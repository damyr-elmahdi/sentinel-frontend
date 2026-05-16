import { Component, signal, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent, SidebarItem } from '../../shared/sidebar/sidebar';

@Pipe({ name: 'adminTitleFor', standalone: true })
export class AdminTitleForPipe implements PipeTransform {
  transform(items: SidebarItem[], id: string): string {
    return items.find(i => i.id === id)?.label ?? '';
  }
}

@Pipe({ name: 'filterEmployees', standalone: true })
export class FilterEmployeesPipe implements PipeTransform {
  transform(employees: any[], search: string): any[] {
    if (!search.trim()) return employees;
    const s = search.toLowerCase();
    return employees.filter(e =>
      e.name.toLowerCase().includes(s) ||
      e.role.toLowerCase().includes(s) ||
      e.department.toLowerCase().includes(s)
    );
  }
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, AdminTitleForPipe, FilterEmployeesPipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent {
  activeSection = signal('status');

  navItems: SidebarItem[] = [
    { id: 'status',   label: 'Sentinel Status',    icon: '🛰️' },
    { id: 'inform',   label: 'Inform',              icon: '📢' },
    { id: 'employees',label: 'Employee Register',   icon: '👥' },
    { id: 'tasks',    label: 'Task Oversight',      icon: '📋' },
    { id: 'schedule', label: 'Schedule Management', icon: '📆' },
  ];

  // ─── STATUS ───────────────────────────────────────────────
  sensors = [
    { id: 'DHT-A1', name: 'DHT11 Node A1', type: 'Environmental', value: '23.4°C / 58%', status: 'online',  lastSeen: '2s ago',  zone: 'Zone A' },
    { id: 'FLM-B1', name: 'Flame Sensor B1', type: 'Fire', value: 'CLEAR', status: 'online',  lastSeen: '1s ago',  zone: 'Zone B' },
    { id: 'WTR-C1', name: 'Water Sensor C1', type: 'Flood', value: 'TRIGGERED', status: 'alert',   lastSeen: '3m ago',  zone: 'Zone C' },
    { id: 'RFC-A1', name: 'RFID Node A1', type: 'Access', value: 'ACTIVE', status: 'online',  lastSeen: '12s ago', zone: 'Zone A' },
    { id: 'RFC-D1', name: 'RFID Node D1', type: 'Access', value: 'OFFLINE', status: 'offline', lastSeen: '4h ago',  zone: 'Zone D' },
    { id: 'SRV-B1', name: 'Servo Lock B1', type: 'Actuator', value: 'LOCKED', status: 'online',  lastSeen: '30s ago', zone: 'Zone B' },
    { id: 'RLY-A2', name: 'Relay A2', type: 'Actuator', value: 'OFF', status: 'online',  lastSeen: '1m ago',  zone: 'Zone A' },
    { id: 'BZR-C1', name: 'Buzzer C1', type: 'Actuator', value: 'SILENT', status: 'online',  lastSeen: '2m ago',  zone: 'Zone C' },
  ];

  recentAlerts = [
    { time: '14:33', level: 'CRIT', msg: 'Water sensor C1 triggered — possible flood event', zone: 'Zone C' },
    { time: '14:22', level: 'WARN', msg: 'RFID Node D1 went offline', zone: 'Zone D' },
    { time: '13:58', level: 'INFO', msg: 'Employee John Doe clocked in at Gate A', zone: 'Zone A' },
    { time: '13:44', level: 'INFO', msg: 'AI anomaly score elevated on thermal pattern', zone: 'Zone B' },
    { time: '12:00', level: 'OK',   msg: 'System health check passed — all nodes nominal', zone: 'ALL' },
  ];

  alertStyle(l: string) {
    return l === 'CRIT' ? { background: '#fee2e2', color: '#dc2626' } :
           l === 'WARN' ? { background: '#fef3c7', color: '#d97706' } :
           l === 'OK'   ? { background: '#dcfce7', color: '#16a34a' } :
                          { background: '#dbeafe', color: '#1e40af' };
  }

  sensorStatusStyle(s: string) {
    return s === 'online'  ? { background: '#dcfce7', color: '#16a34a' } :
           s === 'alert'   ? { background: '#fee2e2', color: '#dc2626' } :
                             { background: '#f1f5f9', color: '#64748b' };
  }

  get onlineCount()  { return this.sensors.filter(s => s.status === 'online').length; }
  get alertCount()   { return this.sensors.filter(s => s.status === 'alert').length; }
  get offlineCount() { return this.sensors.filter(s => s.status === 'offline').length; }

  // ─── INFORM ───────────────────────────────────────────────
  announcements = [
    { id: 1, title: 'System maintenance window', body: 'Scheduled downtime on May 20th, 02:00–04:00 UTC. All sensors will be offline.', author: 'Admin', date: '2025-05-14', priority: 'HIGH' },
    { id: 2, title: 'New RFID badge policy', body: 'All employees must re-register their RFID badges before June 1st.', author: 'Admin', date: '2025-05-12', priority: 'MEDIUM' },
    { id: 3, title: 'Q2 Security review', body: 'The quarterly security audit will be conducted the week of May 26th.', author: 'Admin', date: '2025-05-10', priority: 'LOW' },
  ];
  newAnnouncement = { title: '', body: '', priority: 'MEDIUM' };
  sendingAnnouncement = signal(false);

  sendAnnouncement() {
    if (!this.newAnnouncement.title.trim() || !this.newAnnouncement.body.trim()) return;
    this.announcements.unshift({
      id: Date.now(),
      title: this.newAnnouncement.title,
      body: this.newAnnouncement.body,
      author: 'Admin',
      date: new Date().toISOString().split('T')[0],
      priority: this.newAnnouncement.priority
    });
    this.newAnnouncement = { title: '', body: '', priority: 'MEDIUM' };
    this.sendingAnnouncement.set(false);
  }

  deleteAnnouncement(id: number) { this.announcements = this.announcements.filter(a => a.id !== id); }
  annPriorityStyle(p: string) {
    return p === 'HIGH' ? { background: '#fee2e2', color: '#dc2626' } :
           p === 'MEDIUM' ? { background: '#fef3c7', color: '#d97706' } :
           { background: '#dbeafe', color: '#1e40af' };
  }

  // ─── EMPLOYEES ────────────────────────────────────────────
  employeeSearch = '';
  showAddEmployee = signal(false);
  editEmployee = signal<any | null>(null);

  employees = [
    { id: 1, name: 'John Doe',    role: 'Security Officer',  department: 'Physical Security', badge: 'EMP-0042', status: 'active',  email: 'john.doe@sentinel.io',    joined: '2024-03-01' },
    { id: 2, name: 'Sara Ahmed',  role: 'Shift Supervisor',  department: 'Physical Security', badge: 'EMP-0031', status: 'active',  email: 'sara.ahmed@sentinel.io',   joined: '2023-09-15' },
    { id: 3, name: 'Marc Dupont', role: 'CCTV Operator',     department: 'Surveillance',       badge: 'EMP-0057', status: 'active',  email: 'marc.dupont@sentinel.io',  joined: '2024-01-22' },
    { id: 4, name: 'Liu Wei',     role: 'IT Security',       department: 'Infrastructure',     badge: 'EMP-0019', status: 'active',  email: 'liu.wei@sentinel.io',      joined: '2022-11-08' },
    { id: 5, name: 'Anna Kovacs', role: 'Access Controller', department: 'Physical Security', badge: 'EMP-0065', status: 'inactive',email: 'anna.kovacs@sentinel.io',  joined: '2024-06-01' },
  ];

  newEmployee = { name: '', role: '', department: '', email: '', badge: '' };

  addEmployee() {
    if (!this.newEmployee.name.trim()) return;
    this.employees.push({ ...this.newEmployee, id: Date.now(), status: 'active', joined: new Date().toISOString().split('T')[0] });
    this.newEmployee = { name: '', role: '', department: '', email: '', badge: '' };
    this.showAddEmployee.set(false);
  }

  startEditEmployee(e: any) { this.editEmployee.set({ ...e }); }
  saveEditEmployee() {
    const idx = this.employees.findIndex(e => e.id === this.editEmployee()!.id);
    if (idx !== -1) this.employees[idx] = { ...this.editEmployee()! };
    this.editEmployee.set(null);
  }
  deleteEmployee(id: number) { this.employees = this.employees.filter(e => e.id !== id); }

  // ─── TASKS ────────────────────────────────────────────────
  adminTasks = [
    { id: 1, text: 'Investigate water sensor C1 trigger', assignedTo: 'John Doe',    priority: 'HIGH',   status: 'IN PROGRESS', due: '2025-05-20' },
    { id: 2, text: 'Replace RFID Node D1 battery',        assignedTo: 'Liu Wei',     priority: 'MEDIUM', status: 'PENDING',     due: '2025-05-22' },
    { id: 3, text: 'Conduct Zone D perimeter check',      assignedTo: 'Sara Ahmed',  priority: 'HIGH',   status: 'PENDING',     due: '2025-05-19' },
    { id: 4, text: 'Update employee RFID database',       assignedTo: 'Liu Wei',     priority: 'LOW',    status: 'DONE',        due: '2025-05-18' },
    { id: 5, text: 'Monthly fire sensor calibration',     assignedTo: 'Marc Dupont', priority: 'MEDIUM', status: 'DONE',        due: '2025-05-15' },
  ];

  newAdminTask = { text: '', assignedTo: '', priority: 'MEDIUM', due: '' };
  showAddTask = signal(false);

  addAdminTask() {
    if (!this.newAdminTask.text.trim()) return;
    this.adminTasks.unshift({ ...this.newAdminTask, id: Date.now(), status: 'PENDING' });
    this.newAdminTask = { text: '', assignedTo: '', priority: 'MEDIUM', due: '' };
    this.showAddTask.set(false);
  }
  deleteAdminTask(id: number) { this.adminTasks = this.adminTasks.filter(t => t.id !== id); }
  cycleTaskStatus(t: any) {
    const cycle = ['PENDING','IN PROGRESS','DONE'];
    t.status = cycle[(cycle.indexOf(t.status) + 1) % cycle.length];
  }
  taskStatusStyle(s: string) {
    return s === 'DONE' ? { background: '#dcfce7', color: '#16a34a' } :
           s === 'IN PROGRESS' ? { background: '#fef3c7', color: '#d97706' } :
           { background: '#f1f5f9', color: '#64748b' };
  }
  taskPriorityStyle(p: string) {
    return p === 'HIGH' ? { background: '#fee2e2', color: '#dc2626' } :
           p === 'MEDIUM' ? { background: '#fef3c7', color: '#d97706' } :
           { background: '#dbeafe', color: '#1e40af' };
  }

  // ─── SCHEDULE ─────────────────────────────────────────────
  schedules = [
    { id: 1, employeeName: 'John Doe',    date: '2025-05-19', timeStart: '08:00', timeEnd: '16:00', zone: 'Zone A — Main Entrance' },
    { id: 2, employeeName: 'Sara Ahmed',  date: '2025-05-19', timeStart: '16:00', timeEnd: '00:00', zone: 'Zone B — Server Room' },
    { id: 3, employeeName: 'Marc Dupont', date: '2025-05-20', timeStart: '08:00', timeEnd: '16:00', zone: 'Zone C — Parking' },
    { id: 4, employeeName: 'John Doe',    date: '2025-05-22', timeStart: '00:00', timeEnd: '08:00', zone: 'Zone A — Main Entrance' },
    { id: 5, employeeName: 'Anna Kovacs', date: '2025-05-26', timeStart: '08:00', timeEnd: '16:00', zone: 'Zone D — Rooftop Access' },
  ];
  editSchedule = signal<any | null>(null);
  showAddSchedule = signal(false);
  newSchedule = { employeeName: '', date: '', timeStart: '', timeEnd: '', zone: '' };

  addSchedule() {
    if (!this.newSchedule.employeeName.trim() || !this.newSchedule.date) return;
    this.schedules.push({ ...this.newSchedule, id: Date.now() });
    this.newSchedule = { employeeName: '', date: '', timeStart: '', timeEnd: '', zone: '' };
    this.showAddSchedule.set(false);
  }
  startEditSchedule(s: any) { this.editSchedule.set({ ...s }); }
  saveEditSchedule() {
    const idx = this.schedules.findIndex(s => s.id === this.editSchedule()!.id);
    if (idx !== -1) this.schedules[idx] = { ...this.editSchedule()! };
    this.editSchedule.set(null);
  }
  deleteSchedule(id: number) { this.schedules = this.schedules.filter(s => s.id !== id); }
}
