import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, CommonModule, NavbarComponent],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class LandingComponent {
  partners = [
    { name: 'Siemens', abbr: 'SIE' },
    { name: 'Honeywell', abbr: 'HON' },
    { name: 'Bosch Security', abbr: 'BSC' },
    { name: 'Axis Comm.', abbr: 'AXS' },
    { name: 'Hikvision', abbr: 'HIK' },
    { name: 'Genetec', abbr: 'GEN' },
    { name: 'Milestone', abbr: 'MLS' },
    { name: 'Lenel S2', abbr: 'LNL' },
    { name: 'Verkada', abbr: 'VRK' },
  ];

  stats = [
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '<50ms', label: 'Alert Latency' },
    { value: '256-bit', label: 'Encryption' },
    { value: '24/7', label: 'Monitoring' },
  ];

  features = [
    { icon: '⚡', title: 'Real-Time Monitoring', desc: 'ESP32 nodes stream environmental and RFID data continuously to your dashboard via WebSocket.' },
    { icon: '🔐', title: 'JWT Authentication', desc: 'Spring Boot REST API with layered access control ensures only authorized personnel reach critical systems.' },
    { icon: '🤖', title: 'AI Anomaly Detection', desc: 'Python ML service analyzes sensor patterns and fires instant push notifications on anomalous behavior.' },
    { icon: '📡', title: 'IoT Device Control', desc: 'Remote servo, relay, and buzzer actuation from the admin dashboard via MQTT/HTTP command dispatching.' },
    { icon: '📱', title: 'Mobile Companion', desc: 'Flutter mobile app delivers real-time alerts and remote access on the go via Firebase Cloud Messaging.' },
    { icon: '📊', title: 'Full Audit Trail', desc: 'MongoDB persists every sensor event, employee action, and system command for complete traceability.' },
  ];

  mockSensors = [
    { icon: '🌡️', name: 'DHT11 TEMP', value: '23.4°C', status: 'OK', ok: true },
    { icon: '💧', name: 'WATER SNS', value: 'DRY', status: 'OK', ok: true },
    { icon: '🔥', name: 'FLAME SNS', value: 'CLEAR', status: 'OK', ok: true },
    { icon: '🏷️', name: 'RFID NODE', value: 'ACTIVE', status: 'LIVE', ok: true },
  ];

  mockAlerts = [
    { level: 'WARN', msg: 'Motion detected — Zone B, Entry 2', time: '14:22', style: { background: '#fef3c7', color: '#92400e' } },
    { level: 'INFO', msg: 'RFID badge scan — Employee #0042', time: '14:18', style: { background: '#dbeafe', color: '#1e40af' } },
    { level: 'OK',   msg: 'System health check passed', time: '14:00', style: { background: '#dcfce7', color: '#166534' } },
  ];

  archLayers = [
    { label: 'IOT LAYER', items: ['ESP32 Env Node', 'ESP32 RFID Node', 'DHT11', 'Flame Sensor', 'Water Sensor', 'RC522', 'Servo', 'Relay', 'Buzzer'] },
    { label: 'BACKEND LAYER', items: ['Spring Boot REST', 'JWT Auth', 'WebSocket Service', 'Alert Manager', 'Device Commander'] },
    { label: 'DATA & AI LAYER', items: ['MongoDB', 'Python AI Service', 'Anomaly Detection', 'Firebase Cloud Msg'] },
    { label: 'CLIENT LAYER', items: ['Angular Dashboard', 'Flutter Mobile', 'WebSocket Client', 'Push Notifications'] },
  ];
}
