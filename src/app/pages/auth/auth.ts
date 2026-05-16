import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class AuthComponent {
  mode = signal<'signin' | 'login'>('login');
  showPassword = signal(false);
  policyAccepted = false;
  form = { email: '', password: '', username: '' };

  statusItems = [
    { icon: '🛡️', label: 'ACTIVE NODES', value: '12 Online' },
    { icon: '📍', label: 'SECURED ZONES', value: '4 Areas' },
    { icon: '🤖', label: 'AI ENGINE', value: 'Running' },
    { icon: '☁️', label: 'CLOUD SYNC', value: 'Firebase' },
  ];

  setMode(m: 'signin' | 'login') { this.mode.set(m); }
  togglePassword() { this.showPassword.update(v => !v); }
  onSubmit() {
    if (this.mode() === 'signin' && !this.policyAccepted) {
      alert('Please accept the policy to continue.'); return;
    }
    console.log('Submit', this.form);
  }
}
