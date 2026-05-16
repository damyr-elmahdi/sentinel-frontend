import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent {
  @Input() items: SidebarItem[] = [];
  @Input() activeId = '';
  @Input() role: 'employee' | 'admin' = 'employee';
  @Input() userName = 'John Doe';
  @Input() userRole = 'Security Officer';
  @Output() navSelect = new EventEmitter<string>();

  select(id: string) { this.navSelect.emit(id); }
}
