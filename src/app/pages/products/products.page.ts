import { Component, OnInit, inject } from '@angular/core';
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
import { Product } from '../../models/product';
import { ProductCatalogService, SortMode } from '../../services/product-catalog.service';

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
    RouterLink,
  ],
})
export class ProductsPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly catalogService = inject(ProductCatalogService);
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

  ionViewWillEnter(): void {
    if (!this.searchTerm) {
      return;
    }

    this.searchTerm = '';
    this.currentPage = 1;
    this.syncCatalogState();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.currentPage = 1;
        this.syncCatalogState();
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
    this.syncCatalogState();
  }

  setSortMode(mode: SortMode): void {
    if (this.sortMode === mode) {
      return;
    }

    this.sortMode = mode;
    this.currentPage = 1;
    this.syncCatalogState();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.sortMode = 'featured';
    this.currentPage = 1;
    this.syncCatalogState();
  }

  isSortActive(mode: SortMode): boolean {
    return this.sortMode === mode;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.currentPage = page;
    this.syncCatalogState();
  }

  goToNextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  goToPreviousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  getVisiblePages(): number[] {
    return this.catalogService.getVisiblePages(this.currentPage, this.totalPages);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    if (img) {
      img.src = this.fallbackImage;
    }
  }

  private syncCatalogState(): void {
    const state = this.catalogService.buildState(this.products, {
      searchTerm: this.searchTerm,
      sortMode: this.sortMode,
      currentPage: this.currentPage,
      pageSize: this.pageSize,
    });

    this.filteredProducts = state.filteredProducts;
    this.pagedProducts = state.pagedProducts;
    this.totalProducts = state.totalProducts;
    this.totalPages = state.totalPages;
    this.currentPage = state.currentPage;
  }
}
