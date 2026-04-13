import { Injectable } from '@angular/core';
import { Product } from '../models/product';

export type SortMode = 'featured' | 'nameAsc' | 'priceAsc' | 'priceDesc';

export interface CatalogQuery {
  searchTerm: string;
  sortMode: SortMode;
  currentPage: number;
  pageSize: number;
}

export interface CatalogState {
  filteredProducts: Product[];
  pagedProducts: Product[];
  totalProducts: number;
  totalPages: number;
  currentPage: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductCatalogService {
  buildState(products: Product[], query: CatalogQuery): CatalogState {
    const filteredProducts = this.filterAndSortProducts(products, query);
    const totalProducts = filteredProducts.length;
    const totalPages = Math.max(1, Math.ceil(totalProducts / query.pageSize));
    const currentPage = Math.min(Math.max(1, query.currentPage), totalPages);
    const startIndex = (currentPage - 1) * query.pageSize;

    return {
      filteredProducts,
      pagedProducts: filteredProducts.slice(startIndex, startIndex + query.pageSize),
      totalProducts,
      totalPages,
      currentPage,
    };
  }

  getVisiblePages(currentPage: number, totalPages: number, maxVisible = 3): number[] {
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = end - maxVisible + 1;
    }

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }

  private filterAndSortProducts(products: Product[], query: CatalogQuery): Product[] {
    const normalizedSearch = query.searchTerm.trim().toLowerCase();
    let list = [...products];

    if (normalizedSearch) {
      list = list.filter((product) =>
        product.name.toLowerCase().includes(normalizedSearch)
      );
    }

    if (query.sortMode === 'nameAsc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (query.sortMode === 'priceAsc' || query.sortMode === 'priceDesc') {
      const factor = query.sortMode === 'priceAsc' ? 1 : -1;
      list.sort((a, b) => (a.price - b.price) * factor);
    }

    return list;
  }
}
