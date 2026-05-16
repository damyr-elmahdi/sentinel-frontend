import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html'
})
export class NavbarComponent {
  @Input() transparent = false;
  menuOpen = false;
  toggleMenu() { this.menuOpen = !this.menuOpen; }
}
