import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ApiService } from '../../services/api.service';
import { Product, getFormattedPrice, getLocalizedText } from '../../models/product';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonSpinner,
    IonText,
    IonTitle,
    IonToolbar,
    CommonModule,
    RouterLink,
  ],
})
export class ProductsPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);

  products: Product[] = [];
  pagedProducts: Product[] = [];
  isLoading = true;
  errorMessage = '';
  readonly fallbackImage = 'assets/icon/favicon.png';
  readonly pageSize = 8;
  currentPage = 1;
  totalPages = 1;
  totalProducts = 0;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.totalProducts = products.length;
        this.totalPages = Math.max(1, Math.ceil(this.totalProducts / this.pageSize));
        this.currentPage = 1;
        this.updatePagedProducts();
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

    return Array.from(
      { length: end - start + 1 },
      (_, index) => start + index
    );
  }

  private updatePagedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedProducts = this.products.slice(startIndex, endIndex);
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
}
