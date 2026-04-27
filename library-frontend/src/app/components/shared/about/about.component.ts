import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
  <div style="padding: 24px; display: flex; flex-direction: column; gap: 24px; max-width: 900px; margin: 0 auto;">

    <!-- FEJLÉC -->
    <mat-card style="background: linear-gradient(135deg, #2e7d32, #43a047); color: white; border-radius: 16px;">
      <mat-card-content style="padding: 40px; text-align: center;">
        <div style="font-size: 64px;">📚</div>
        <h1 style="font-family: Poppins, sans-serif; font-size: 32px; margin: 16px 0 8px;">Online Könyvtár</h1>
        <p style="font-size: 16px; opacity: 0.9;">Teljes könyvtárkezelő alkalmazás</p>
        <div style="margin-top: 16px; display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
          <span style="background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 13px;">Angular 21</span>
          <span style="background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 13px;">ASP.NET 10</span>
          <span style="background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 13px;">MongoDB</span>
          <span style="background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 13px;">Docker</span>
          <span style="background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 13px;">Kubernetes</span>
          <span style="background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 13px;">ArgoCD</span>
        </div>
      </mat-card-content>
    </mat-card>

    <!-- FUNKCIÓK -->
    <mat-card>
      <mat-card-header>
        <mat-card-title>⚡ Funkciók</mat-card-title>
      </mat-card-header>
      <mat-card-content style="padding-top: 16px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
          <div *ngFor="let f of features" style="display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 10px; background: #f1f8f1;">
            <mat-icon style="color: #2e7d32;">{{ f.icon }}</mat-icon>
            <span style="font-size: 14px;">{{ f.text }}</span>
          </div>
        </div>
      </mat-card-content>
    </mat-card>

    <!-- CSAPAT -->
    <mat-card>
      <mat-card-header>
        <mat-card-title>👥 Csapat</mat-card-title>
      </mat-card-header>
      <mat-card-content style="padding-top: 16px;">
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          <div *ngFor="let m of team" style="flex: 1; min-width: 150px; padding: 20px; border-radius: 12px; background: #f1f8f1; text-align: center;">
            <div style="font-size: 40px;">{{ m.avatar }}</div>
            <div style="font-weight: 600; margin-top: 8px;">{{ m.name }}</div>
            <div style="font-size: 13px; color: #666; margin-top: 4px;">{{ m.role }}</div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>

    <!-- TECHNOLÓGIÁK -->
    <mat-card>
      <mat-card-header>
        <mat-card-title>🏗️ Technológiák</mat-card-title>
      </mat-card-header>
      <mat-card-content style="padding-top: 16px;">
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div *ngFor="let t of technologies" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-radius: 10px; background: #f1f8f1;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <mat-icon style="color: #2e7d32;">{{ t.icon }}</mat-icon>
              <div>
                <div style="font-weight: 600; font-size: 14px;">{{ t.name }}</div>
                <div style="font-size: 12px; color: #666;">{{ t.description }}</div>
              </div>
            </div>
            <span style="background: #e8f5e9; color: #2e7d32; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 600;">{{ t.version }}</span>
          </div>
        </div>
      </mat-card-content>
    </mat-card>

  </div>
  `
})
export class AboutComponent {
  features = [
    { icon: 'menu_book', text: 'Könyvek CRUD kezelése' },
    { icon: 'people', text: 'Szerzők CRUD kezelése' },
    { icon: 'search', text: 'Keresés és szűrés' },
    { icon: 'sort', text: 'Rendezés' },
    { icon: 'bar_chart', text: 'Dashboard diagramok' },
    { icon: 'dark_mode', text: 'Dark mode' },
    { icon: 'notifications', text: 'Snackbar értesítések' },
    { icon: 'delete', text: 'Törlés megerősítés' },
  ];

  team = [
    { avatar: '👨‍💻', name: 'Nagy Péter - TRVUMF', role: 'Backend & DevOps' },
    { avatar: '👨‍🎨', name: 'Puizl Attila - SK4MX8', role: 'Frontend & UI' },
    { avatar: '👨‍🔧', name: 'Papp Gyula - HBTD9H', role: 'Frontend & UI' },
    { avatar: '👨‍💼', name: 'Werbinszky Gábor - AQW4RP', role: 'Kubernetes, Docker & CI/CD' },
    { avatar: '👩‍💻', name: 'Tóth Tamás - GHKFCW', role: 'Dokumentáció és Tesztelés,szervezés' },
  ];

  technologies = [
    { icon: 'web', name: 'Angular 21', description: 'Frontend framework', version: 'v21' },
    { icon: 'api', name: 'ASP.NET 10', description: 'Backend REST API', version: 'v10' },
    { icon: 'storage', name: 'MongoDB', description: 'NoSQL adatbázis', version: 'v8' },
    { icon: 'dock', name: 'Docker', description: 'Konténerizálás', version: 'latest' },
    { icon: 'cloud', name: 'Kubernetes', description: 'Orchestráció', version: 'v1.35' },
    { icon: 'sync', name: 'ArgoCD', description: 'GitOps CD pipeline', version: 'v3.3' },
  ];
}