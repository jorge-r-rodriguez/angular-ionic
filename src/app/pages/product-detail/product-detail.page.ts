import { Component, OnInit, inject } from '@angular/core';
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
  IonToolbar,
} from '@ionic/angular/standalone';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product';

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
    IonToolbar,
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

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    if (img) {
      img.src = this.fallbackImage;
    }
  }
}
