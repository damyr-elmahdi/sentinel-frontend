import { Component, HostListener, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  host: { style: 'display: contents' }
})
export class NavbarComponent {
  @Input() transparent = false;
  menuOpen = false;
  scrolled = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 8;
  }
}
