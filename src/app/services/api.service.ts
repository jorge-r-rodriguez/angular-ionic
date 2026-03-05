import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { Observable, catchError, from, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product, ProductsResponse, ProductResponse } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = this.getBaseUrl();
  private readonly apiKey = environment.apiKey;
  private readonly http = inject(HttpClient);
  private readonly isNative = Capacitor.isNativePlatform();

  private getBaseUrl(): string {
    const isLocalhost =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1');
    const isDevServerPort =
      typeof window !== 'undefined' &&
      (window.location.port === '4200' || window.location.port === '8100');

    return !environment.production && isLocalhost && isDevServerPort
      ? '/api'
      : environment.apiUrl;
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.apiKey}:`)}`,
      Accept: 'application/json',
    });
  }

  getProducts(): Observable<Product[]> {
    if (this.isNative) {
      return this.getProductsNative();
    }

    const url =
      `${this.baseUrl}/products?display=[id,name,price,id_default_image]&output_format=JSON`;

    return this.http.get<ProductsResponse>(url, { headers: this.getHeaders() }).pipe(
      map((response) => response.products ?? []),
      map((products) => products.map((product) => this.normalizeProduct(product))),
      catchError((error) => {
        console.error('Error fetching product list', error);
        return throwError(() => new Error('No se pudo obtener el listado de productos.'));
      })
    );
  }

  getProduct(id: string | number): Observable<Product> {
    if (this.isNative) {
      return this.getProductNative(id);
    }

    const url = `${this.baseUrl}/products/${id}?output_format=JSON`;

    return this.http.get<ProductResponse>(url, { headers: this.getHeaders() }).pipe(
      map((response) => {
        if (!response.product) {
          throw new Error('Producto no encontrado.');
        }
        return this.normalizeProduct(response.product);
      }),
      catchError((error) => {
        console.error(`Error fetching product ${id}`, error);
        return throwError(() => new Error('No se pudo obtener el detalle del producto.'));
      })
    );
  }

  private getProductsNative(): Observable<Product[]> {
    const url =
      `${environment.apiUrl}/products?display=[id,name,price,id_default_image]&output_format=JSON`;

    return from(
      CapacitorHttp.get({
        url,
        headers: {
          Authorization: `Basic ${btoa(`${this.apiKey}:`)}`,
          Accept: 'application/json',
        },
      })
    ).pipe(
      map((response) => this.parseNativeData<ProductsResponse>(response.data)),
      map((response) => response.products ?? []),
      map((products) => products.map((product) => this.normalizeProduct(product))),
      catchError((error) => {
        console.error('Native error fetching product list', error);
        return throwError(() => new Error('No se pudo obtener el listado de productos.'));
      })
    );
  }

  private getProductNative(id: string | number): Observable<Product> {
    const url = `${environment.apiUrl}/products/${id}?output_format=JSON`;

    return from(
      CapacitorHttp.get({
        url,
        headers: {
          Authorization: `Basic ${btoa(`${this.apiKey}:`)}`,
          Accept: 'application/json',
        },
      })
    ).pipe(
      map((response) => this.parseNativeData<ProductResponse>(response.data)),
      map((response) => {
        if (!response.product) {
          throw new Error('Producto no encontrado.');
        }

        return this.normalizeProduct(response.product);
      }),
      catchError((error) => {
        console.error(`Native error fetching product ${id}`, error);
        return throwError(() => new Error('No se pudo obtener el detalle del producto.'));
      })
    );
  }

  private parseNativeData<T>(data: unknown): T {
    if (typeof data === 'string') {
      return JSON.parse(data) as T;
    }

    return data as T;
  }

  private normalizeProduct(product: Product): Product {
    const imageId = this.getProductImageId(product);

    return {
      ...product,
      id: Number(product.id),
      imageUrl: imageId ? this.buildProductImageUrl(product.id, imageId) : undefined,
    };
  }

  private getProductImageId(product: Product): string | number | null {
    if (product.id_default_image) {
      return product.id_default_image;
    }

    const firstImageId = product.associations?.images?.[0]?.id;
    return firstImageId ?? null;
  }

  private buildProductImageUrl(
    productId: string | number,
    imageId: string | number
  ): string {
    return `${this.baseUrl}/images/products/${productId}/${imageId}?ws_key=${this.apiKey}`;
  }
}
