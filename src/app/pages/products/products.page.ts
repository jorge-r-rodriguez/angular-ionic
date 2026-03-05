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
  isLoading = true;
  errorMessage = '';
  readonly fallbackImage = 'assets/icon/favicon.png';

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
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
