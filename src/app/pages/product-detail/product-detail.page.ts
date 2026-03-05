import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ApiService } from '../../services/api.service';
import { Product, getFormattedPrice, getLocalizedText } from '../../models/product';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  standalone: true,
  imports: [
    IonBackButton,
    IonBadge,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonSpinner,
    IonText,
    IonTitle,
    IonToolbar,
    CommonModule,
    RouterLink,
  ],
})
export class ProductDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly apiService = inject(ApiService);

  product: Product | null = null;
  isLoading = true;
  errorMessage = '';
  readonly fallbackImage = 'assets/icon/favicon.png';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'No se recibio un identificador de producto valido.';
      this.isLoading = false;
      return;
    }

    this.loadProduct(id);
  }

  loadProduct(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error(`Error loading product ${id}`, error);
        this.errorMessage = error.message;
        this.isLoading = false;
      },
    });
  }

  getProductName(): string {
    return getLocalizedText(this.product?.name, 'Producto sin nombre');
  }

  getProductPrice(): string {
    if (!this.product) {
      return 'EUR 0.00';
    }

    return getFormattedPrice(this.product.price);
  }

  getProductDescription(): string {
    return getLocalizedText(
      this.product?.description ?? this.product?.description_short,
      'No hay descripcion disponible para este producto.'
    );
  }

  getProductImage(): string {
    return this.product?.imageUrl ?? this.fallbackImage;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    if (img) {
      img.src = this.fallbackImage;
    }
  }
}
