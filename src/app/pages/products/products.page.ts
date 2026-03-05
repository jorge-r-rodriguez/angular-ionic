import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { personOutline, searchOutline } from 'ionicons/icons';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  IonText,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ApiService } from '../../services/api.service';
import { Product, getFormattedPrice, getLocalizedText } from '../../models/product';

type SortMode = 'featured' | 'nameAsc' | 'priceAsc' | 'priceDesc';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonSpinner,
    IonText,
    IonToolbar,
    CommonModule,
    RouterLink,
  ],
})
export class ProductsPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);

  products: Product[] = [];
  filteredProducts: Product[] = [];
  pagedProducts: Product[] = [];
  isLoading = true;
  errorMessage = '';
  readonly fallbackImage = 'assets/icon/favicon.png';
  readonly pageSize = 8;
  readonly skeletonItems = Array.from({ length: 6 });

  searchTerm = '';
  sortMode: SortMode = 'featured';
  currentPage = 1;
  totalPages = 1;
  totalProducts = 0;

  constructor() {
    addIcons({ personOutline, searchOutline });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.currentPage = 1;
        this.applyFiltersAndPagination();
        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error('Error loading products', error);
        this.errorMessage = error.message;
        this.isLoading = false;
      },
    });
  }

  goToDetail(product: Product): void {
    this.router.navigate(['/product-detail', product.id]);
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    this.searchTerm = input?.value ?? '';
    this.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  setSortMode(mode: SortMode): void {
    if (this.sortMode === mode) {
      return;
    }

    this.sortMode = mode;
    this.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.sortMode = 'featured';
    this.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  isSortActive(mode: SortMode): boolean {
    return this.sortMode === mode;
  }

  getProductName(product: Product): string {
    return getLocalizedText(product.name, 'Producto sin nombre');
  }

  getProductPrice(product: Product): string {
    return getFormattedPrice(product.price);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.currentPage = page;
    this.updatePagedProducts();
  }

  goToNextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  goToPreviousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  getVisiblePages(): number[] {
    const maxVisible = 3;

    if (this.totalPages <= maxVisible) {
      return Array.from({ length: this.totalPages }, (_, index) => index + 1);
    }

    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, this.currentPage - half);
    let end = start + maxVisible - 1;

    if (end > this.totalPages) {
      end = this.totalPages;
      start = end - maxVisible + 1;
    }

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }

  getProductImage(product: Product): string {
    return product.imageUrl ?? this.fallbackImage;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    if (img) {
      img.src = this.fallbackImage;
    }
  }

  private applyFiltersAndPagination(): void {
    const normalizedSearch = this.searchTerm.trim().toLowerCase();

    let list = [...this.products];

    if (normalizedSearch) {
      list = list.filter((product) =>
        this.getProductName(product).toLowerCase().includes(normalizedSearch)
      );
    }

    if (this.sortMode === 'nameAsc') {
      list.sort((a, b) => this.getProductName(a).localeCompare(this.getProductName(b)));
    }

    if (this.sortMode === 'priceAsc' || this.sortMode === 'priceDesc') {
      const factor = this.sortMode === 'priceAsc' ? 1 : -1;
      list.sort((a, b) => (this.toNumericPrice(a.price) - this.toNumericPrice(b.price)) * factor);
    }

    this.filteredProducts = list;
    this.totalProducts = list.length;
    this.totalPages = Math.max(1, Math.ceil(this.totalProducts / this.pageSize));

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    this.updatePagedProducts();
  }

  private updatePagedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  private toNumericPrice(price: string | number): number {
    const numeric = typeof price === 'string' ? Number.parseFloat(price) : Number(price);
    return Number.isNaN(numeric) ? 0 : numeric;
  }
}
