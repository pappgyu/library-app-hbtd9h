import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BookService } from '../../../services/book.service';
import { AuthorService } from '../../../services/author.service';
import { Book } from '../../../models/book.model';
import { Author } from '../../../models/author.model';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink, MatButtonModule,
    MatInputModule, MatFormFieldModule, MatIconModule, MatCardModule,
    MatSelectModule, MatPaginatorModule, MatDialogModule, MatSnackBarModule
  ],
  template: `
  <div style="padding: 24px; display: flex; flex-direction: column; gap: 24px;">

    <!-- STAT BLOKKOK -->
    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
      <mat-card style="flex: 1; min-width: 150px; background: linear-gradient(135deg, #3f51b5, #5c6bc0); color: white; border-radius: 12px;">
        <mat-card-content style="padding: 20px;">
          <div class="stat-number" style="font-size: 32px; font-weight: 700;">{{ books.length }}</div>
          <div style="font-size: 14px; opacity: 0.9; margin-top: 4px;">📚 Összes könyv</div>
        </mat-card-content>
      </mat-card>
      <mat-card style="flex: 1; min-width: 150px; background: linear-gradient(135deg, #ff4081, #f48fb1); color: white; border-radius: 12px;">
        <mat-card-content style="padding: 20px;">
          <div class="stat-number" style="font-size: 32px; font-weight: 700;">{{ authors.length }}</div>
          <div style="font-size: 14px; opacity: 0.9; margin-top: 4px;">✍️ Szerzők száma</div>
        </mat-card-content>
      </mat-card>
      <mat-card style="flex: 1; min-width: 150px; background: linear-gradient(135deg, #00897b, #4db6ac); color: white; border-radius: 12px;">
        <mat-card-content style="padding: 20px;">
          <div class="stat-number" style="font-size: 32px; font-weight: 700;">{{ getLatestYear() }}</div>
          <div style="font-size: 14px; opacity: 0.9; margin-top: 4px;">📅 Legújabb könyv éve</div>
        </mat-card-content>
      </mat-card>
      <mat-card style="flex: 1; min-width: 150px; background: linear-gradient(135deg, #f57c00, #ffb74d); color: white; border-radius: 12px;">
        <mat-card-content style="padding: 20px;">
          <div class="stat-number" style="font-size: 32px; font-weight: 700;">{{ getGenreCount() }}</div>
          <div style="font-size: 14px; opacity: 0.9; margin-top: 4px;">🎭 Különböző műfajok</div>
        </mat-card-content>
      </mat-card>
    </div>

    <!-- CHARTOK -->
    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
      <mat-card style="flex: 1; min-width: 300px;">
        <mat-card-header>
          <mat-card-title>🎭 Műfajok eloszlása</mat-card-title>
        </mat-card-header>
        <mat-card-content style="padding: 16px; display: flex; justify-content: center;">
          <canvas #pieChart style="max-height: 250px;"></canvas>
        </mat-card-content>
      </mat-card>
      <mat-card style="flex: 2; min-width: 300px;">
        <mat-card-header>
          <mat-card-title>📅 Évek szerinti eloszlás</mat-card-title>
        </mat-card-header>
        <mat-card-content style="padding: 16px;">
          <canvas #barChart style="max-height: 250px;"></canvas>
        </mat-card-content>
      </mat-card>
    </div>

    <!-- FORM KÁRTYA -->
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ editingId ? '✏️ Könyv szerkesztése' : '📘 Új könyv hozzáadása' }}</mat-card-title>
      </mat-card-header>
      <mat-card-content style="padding-top: 16px; display: flex; flex-wrap: wrap; gap: 12px;">
        <mat-form-field appearance="outline" style="flex: 1; min-width: 200px;">
          <mat-label>Cím</mat-label>
          <mat-icon matPrefix>menu_book</mat-icon>
          <input matInput [(ngModel)]="form.title" />
        </mat-form-field>
        <mat-form-field appearance="outline" style="flex: 1; min-width: 200px;">
          <mat-label>Szerző</mat-label>
          <mat-icon matPrefix>person</mat-icon>
          <mat-select [(ngModel)]="form.authorId">
            <mat-option *ngFor="let a of authors" [value]="a.id">{{ a.name }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" style="flex: 1; min-width: 120px;">
          <mat-label>Év</mat-label>
          <mat-icon matPrefix>calendar_today</mat-icon>
          <input matInput type="number" [ngModel]="form.year || ''" (ngModelChange)="form.year = $event" placeholder="pl. 2024" />
        </mat-form-field>
        <mat-form-field appearance="outline" style="flex: 1; min-width: 150px;">
          <mat-label>Műfaj</mat-label>
          <mat-icon matPrefix>category</mat-icon>
          <input matInput [(ngModel)]="form.genre" />
        </mat-form-field>
        <mat-form-field appearance="outline" style="flex: 2; min-width: 300px;">
          <mat-label>Leírás</mat-label>
          <mat-icon matPrefix>description</mat-icon>
          <textarea matInput [(ngModel)]="form.description" rows="1"></textarea>
        </mat-form-field>
      </mat-card-content>
      <mat-card-actions style="padding: 0 16px 16px 16px;">
        <button mat-raised-button color="primary" (click)="save()">
          <mat-icon>save</mat-icon>
          {{ editingId ? 'Mentés' : 'Hozzáadás' }}
        </button>
        <button mat-button *ngIf="editingId" (click)="cancelEdit()" style="margin-left: 8px">
          <mat-icon>cancel</mat-icon>
          Mégse
        </button>
      </mat-card-actions>
    </mat-card>

    <!-- KÖNYVLISTA KÁRTYA -->
    <mat-card>
      <mat-card-header style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <mat-card-title>📚 Könyvlista</mat-card-title>
        <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
          <mat-form-field appearance="outline" style="width: 180px; margin-top: 8px;">
            <mat-label>Keresés</mat-label>
            <mat-icon matPrefix>search</mat-icon>
            <input matInput [(ngModel)]="searchText" (ngModelChange)="applyFilters()" placeholder="Cím, szerző..." />
            <button *ngIf="searchText" matSuffix mat-icon-button (click)="searchText=''; applyFilters()">
              <mat-icon>close</mat-icon>
            </button>
          </mat-form-field>
          <mat-form-field appearance="outline" style="width: 160px; margin-top: 8px;">
            <mat-label>Műfaj szűrő</mat-label>
            <mat-icon matPrefix>filter_list</mat-icon>
            <mat-select [(ngModel)]="selectedGenre" (ngModelChange)="applyFilters()">
              <mat-option value="">Összes műfaj</mat-option>
              <mat-option *ngFor="let g of getGenres()" [value]="g">{{ g }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" style="width: 160px; margin-top: 8px;">
            <mat-label>Rendezés</mat-label>
            <mat-icon matPrefix>sort</mat-icon>
            <mat-select [(ngModel)]="sortBy" (ngModelChange)="applyFilters()">
              <mat-option value="">Alapértelmezett</mat-option>
              <mat-option value="title_asc">Cím (A-Z)</mat-option>
              <mat-option value="title_desc">Cím (Z-A)</mat-option>
              <mat-option value="year_asc">Év (régi-új)</mat-option>
              <mat-option value="year_desc">Év (új-régi)</mat-option>
              <mat-option value="author_asc">Szerző (A-Z)</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </mat-card-header>
      <mat-card-content style="padding-top: 16px;">

        <div *ngIf="filteredBooks.length === 0" style="text-align: center; padding: 32px; color: #999;">
          <mat-icon style="font-size: 48px; width: 48px; height: 48px;">menu_book</mat-icon>
          <p style="margin-top: 8px;">{{ searchText || selectedGenre ? 'Nincs találat' : 'Még nincs könyv felvéve' }}</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          <mat-card *ngFor="let b of pagedBooks" class="fade-in" style="border-left: 4px solid #3f51b5; border-radius: 8px;">
            <mat-card-content style="padding: 16px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <a [routerLink]="['/books', b.id]" style="font-size: 18px; font-weight: 600; color: #3f51b5;">
                  {{ b.title }}
                </a>
                <div style="margin-top: 4px; color: #666; font-size: 14px;">
                  <mat-icon style="font-size: 14px; width: 14px; height: 14px; vertical-align: middle;">person</mat-icon>
                  {{ getAuthorName(b.authorId) }} &bull;
                  <mat-icon style="font-size: 14px; width: 14px; height: 14px; vertical-align: middle;">calendar_today</mat-icon>
                  {{ b.year }}
                </div>
                <div style="margin-top: 4px;">
                  <span style="background: #e8eaf6; color: #3f51b5; padding: 2px 10px; border-radius: 12px; font-size: 12px;">
                    {{ b.genre }}
                  </span>
                </div>
              </div>
              <div>
                <button mat-icon-button color="primary" (click)="edit(b)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="confirmDelete(b.id, b.title)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <mat-paginator
          [length]="filteredBooks.length"
          [pageSize]="pageSize"
          [pageSizeOptions]="[5, 10, 20]"
          (page)="onPage($event)"
          [showFirstLastButtons]="true"
          aria-label="Oldalak"
          style="margin-top: 16px;">
        </mat-paginator>

      </mat-card-content>
    </mat-card>

    <!-- TÖRLÉS MEGERŐSÍTŐ DIALOG -->
    <div *ngIf="showDeleteDialog" style="
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); display: flex; align-items: center;
      justify-content: center; z-index: 9999;">
      <mat-card style="max-width: 400px; width: 90%; border-radius: 16px;">
        <mat-card-header>
          <mat-card-title>🗑️ Törlés megerősítése</mat-card-title>
        </mat-card-header>
        <mat-card-content style="padding: 16px;">
          <p>Biztosan törölni akarod a következő könyvet?</p>
          <p style="font-weight: 600; margin-top: 8px; color: #3f51b5;">„{{ deleteBookTitle }}"</p>
        </mat-card-content>
        <mat-card-actions style="padding: 8px 16px 16px; display: flex; gap: 8px; justify-content: flex-end;">
          <button mat-button (click)="showDeleteDialog = false">
            <mat-icon>cancel</mat-icon> Mégse
          </button>
          <button mat-raised-button color="warn" (click)="executeDelete()">
            <mat-icon>delete</mat-icon> Törlés
          </button>
        </mat-card-actions>
      </mat-card>
    </div>

  </div>
  `
})
export class BookListComponent implements OnInit, AfterViewInit {
  @ViewChild('pieChart') pieChartRef!: ElementRef;
  @ViewChild('barChart') barChartRef!: ElementRef;

  books: Book[] = [];
  filteredBooks: Book[] = [];
  pagedBooks: Book[] = [];
  authors: Author[] = [];
  form: Book = { title: '', authorId: '', year: null, genre: '', description: '' };
  editingId: string | null = null;
  pageSize = 5;
  pageIndex = 0;
  searchText = '';
  selectedGenre = '';
  sortBy = '';
  showDeleteDialog = false;
  deleteBookId: string | undefined;
  deleteBookTitle = '';

  private pieChartInstance: Chart | null = null;
  private barChartInstance: Chart | null = null;

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.load();
    this.authorService.getAll().subscribe(a => {
      this.authors = a;
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit() {}

  load() {
    this.bookService.getAll().subscribe(data => {
      this.books = data;
      this.applyFilters();
      this.cdr.detectChanges();
      setTimeout(() => this.updateCharts(), 100);
    });
  }

  updateCharts() {
    this.updatePieChart();
    this.updateBarChart();
  }

  updatePieChart() {
    if (!this.pieChartRef) return;
    const genreMap: { [key: string]: number } = {};
    this.books.forEach(b => {
      if (b.genre) genreMap[b.genre] = (genreMap[b.genre] || 0) + 1;
    });
    const labels = Object.keys(genreMap);
    const data = Object.values(genreMap);
    const colors = ['#3f51b5','#ff4081','#00897b','#f57c00','#9c27b0','#e53935','#0288d1','#558b2f'];
    if (this.pieChartInstance) this.pieChartInstance.destroy();
    this.pieChartInstance = new Chart(this.pieChartRef.nativeElement, {
      type: 'pie',
      data: { labels, datasets: [{ data, backgroundColor: colors }] },
      options: { plugins: { legend: { position: 'bottom' } }, responsive: true }
    });
  }

  updateBarChart() {
    if (!this.barChartRef) return;
    const yearMap: { [key: string]: number } = {};
    this.books.forEach(b => {
      if (b.year) yearMap[b.year] = (yearMap[b.year] || 0) + 1;
    });
    const labels = Object.keys(yearMap).sort();
    const data = labels.map(y => yearMap[y]);
    if (this.barChartInstance) this.barChartInstance.destroy();
    this.barChartInstance = new Chart(this.barChartRef.nativeElement, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Könyvek száma', data, backgroundColor: '#3f51b5', borderRadius: 6 }] },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
    });
  }

  confirmDelete(id: string | undefined, title: string) {
    this.deleteBookId = id;
    this.deleteBookTitle = title;
    this.showDeleteDialog = true;
  }

  executeDelete() {
    this.showDeleteDialog = false;
    if (this.deleteBookId) {
      this.bookService.delete(this.deleteBookId).subscribe(() => {
        this.snackBar.open('✅ Könyv sikeresen törölve!', 'Bezárás', {
          duration: 3000,
          panelClass: ['snack-success']
        });
        this.load();
      });
    }
  }

  applyFilters() {
    const text = this.searchText.toLowerCase();
    let result = this.books.filter(b => {
      const matchesSearch = !text ||
        b.title.toLowerCase().includes(text) ||
        b.genre.toLowerCase().includes(text) ||
        this.getAuthorName(b.authorId).toLowerCase().includes(text);
      const matchesGenre = !this.selectedGenre || b.genre === this.selectedGenre;
      return matchesSearch && matchesGenre;
    });
    switch (this.sortBy) {
      case 'title_asc': result.sort((a, b) => a.title.localeCompare(b.title)); break;
      case 'title_desc': result.sort((a, b) => b.title.localeCompare(a.title)); break;
      case 'year_asc': result.sort((a, b) => (a.year ?? 0) - (b.year ?? 0)); break;
      case 'year_desc': result.sort((a, b) => (b.year ?? 0) - (a.year ?? 0)); break;
      case 'author_asc': result.sort((a, b) => this.getAuthorName(a.authorId).localeCompare(this.getAuthorName(b.authorId))); break;
    }
    this.filteredBooks = result;
    this.pageIndex = 0;
    this.updatePage();
  }

  getGenres(): string[] {
    return [...new Set(this.books.map(b => b.genre).filter(g => g))].sort();
  }

  updatePage() {
    const start = this.pageIndex * this.pageSize;
    this.pagedBooks = this.filteredBooks.slice(start, start + this.pageSize);
  }

  onPage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePage();
  }

  getAuthorName(authorId: string): string {
    const author = this.authors.find(a => a.id === authorId);
    return author ? author.name : 'Ismeretlen';
  }

  getLatestYear(): number | string {
    if (this.books.length === 0) return '-';
    return Math.max(...this.books.map(b => b.year ?? 0));
  }

  getGenreCount(): number {
    return new Set(this.books.map(b => b.genre).filter(g => g)).size;
  }

  save() {
    if (this.editingId) {
      this.bookService.update(this.editingId, this.form).subscribe(() => {
        setTimeout(() => {
          this.editingId = null;
          this.form = { title: '', authorId: '', year: null, genre: '', description: '' };
          this.cdr.detectChanges();
          this.load();
          this.snackBar.open('✅ Könyv sikeresen módosítva!', 'Bezárás', { duration: 3000 });
        });
      });
    } else {
      this.bookService.create(this.form).subscribe(() => {
        setTimeout(() => {
          this.form = { title: '', authorId: '', year: null, genre: '', description: '' };
          this.cdr.detectChanges();
          this.load();
          this.snackBar.open('✅ Könyv sikeresen hozzáadva!', 'Bezárás', { duration: 3000 });
        });
      });
    }
  }

  edit(book: Book) {
    this.editingId = book.id!;
    this.form = { ...book };
  }

  cancelEdit() {
    this.editingId = null;
    this.form = { title: '', authorId: '', year: null, genre: '', description: '' };
  }

  delete(id: string | undefined) {
    if (id) this.bookService.delete(id).subscribe(() => this.load());
  }
}
