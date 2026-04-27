import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../services/theme.service'

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, MatListModule, MatIconModule, MatTooltipModule, MatSlideToggleModule, CommonModule],
  styles: [`
    .sidebar {
      background: linear-gradient(180deg, #1a237e 0%, #283593 60%, #3949ab 100%);
      height: 100vh;
      display: flex;
      flex-direction: column;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      box-shadow: 4px 0 12px rgba(0,0,0,0.15);
    }

    .logo {
      padding: 24px 16px 20px;
      color: white;
      font-family: 'Poppins', sans-serif;
      font-weight: 700;
      font-size: 18px;
      white-space: nowrap;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .logo-icon {
      font-size: 28px;
      min-width: 28px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      margin: 4px 8px;
      border-radius: 10px;
      color: rgba(255,255,255,0.75);
      text-decoration: none;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .nav-item:hover {
      background: rgba(255,255,255,0.12);
      color: white;
      transform: translateX(4px);
    }

    .nav-item.active-link {
      background: rgba(255,255,255,0.2);
      color: white;
      border-left: 4px solid #ff4081;
      padding-left: 12px;
      font-weight: 600;
    }

    .nav-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      min-width: 20px;
    }

    .collapse-btn {
      margin: auto 8px 0;
      padding: 10px 16px;
      border-radius: 10px;
      color: rgba(255,255,255,0.6);
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 13px;
      white-space: nowrap;
    }

    .collapse-btn:hover {
      background: rgba(255,255,255,0.1);
      color: white;
    }

    .theme-toggle {
      margin: 8px 8px 16px;
      padding: 14px 16px 10px;
      border-radius: 10px;
      color: rgba(255,255,255,0.7);
      display: flex;
      align-items: center;
      gap: 12px;
      white-space: nowrap;
      border-top: 1px solid rgba(255,255,255,0.1);
      cursor: pointer;
    }

    .theme-toggle mat-icon {
      min-width: 20px;
      font-size: 20px;
    }

    .theme-toggle span {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
    }

    .content {
      flex: 1;
      overflow-y: auto;
      background: inherit;
      transition: background-color 0.3s ease;
    }

    .content.dark-mode {
      background: #1a1a2e !important;
    }
  `],
  template: `
    <div style="display: flex; height: 100vh;">

      <div class="sidebar" [style.width]="collapsed ? '64px' : '220px'">

        <div class="logo">
          <span class="logo-icon">📚</span>
          <span *ngIf="!collapsed">Online-könyvtár</span>
        </div>

        <nav>
          <a class="nav-item"
             routerLink="/books"
             routerLinkActive="active-link"
             [matTooltip]="collapsed ? 'Könyvek' : ''"
             matTooltipPosition="right">
            <mat-icon class="nav-icon">menu_book</mat-icon>
            <span *ngIf="!collapsed">Könyvek</span>
          </a>

          <a class="nav-item"
             routerLink="/authors"
             routerLinkActive="active-link"
             [matTooltip]="collapsed ? 'Szerzők' : ''"
             matTooltipPosition="right">
            <mat-icon class="nav-icon">people</mat-icon>
            <span *ngIf="!collapsed">Szerzők</span>
          </a>
        </nav>

        <div class="collapse-btn" (click)="collapsed = !collapsed"
             [matTooltip]="collapsed ? 'Kibontás' : ''"
             matTooltipPosition="right">
          <mat-icon style="min-width: 20px; transition: transform 0.3s ease;"
                    [style.transform]="collapsed ? 'rotate(180deg)' : 'rotate(0deg)'">
            chevron_left
          </mat-icon>
          <span *ngIf="!collapsed" style="font-size: 13px;">Összecsukás</span>
        </div>

        <!-- Dark mode toggle -->
        <div class="theme-toggle"
             [matTooltip]="collapsed ? (themeService.isDarkMode() ? 'Light mód' : 'Dark mód') : ''"
             matTooltipPosition="right"
             (click)="collapsed ? themeService.toggleTheme() : null">
          <mat-icon>{{ themeService.isDarkMode() ? 'dark_mode' : 'light_mode' }}</mat-icon>
          <ng-container *ngIf="!collapsed">
            <span>Dark mód</span>
            <mat-slide-toggle
              [checked]="themeService.isDarkMode()"
              (change)="themeService.toggleTheme()"
              color="accent">
            </mat-slide-toggle>
          </ng-container>
        </div>

      </div>

      <div class="content" [class.dark-mode]="themeService.isDarkMode()">
        <router-outlet></router-outlet>
      </div>

    </div>
  `
})
export class NavbarComponent implements OnInit {
  collapsed = false;

  constructor(public themeService: ThemeService) {}

  @HostListener('window:resize')
  onResize() {
    this.collapsed = window.innerWidth < 768;
  }

  ngOnInit() {
    this.collapsed = window.innerWidth < 768;
    this.themeService.loadSavedTheme();
  }
}
