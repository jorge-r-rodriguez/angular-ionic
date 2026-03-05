export interface PrestashopLanguageValue {
  id?: string | number;
  value?: string;
}

export interface PrestashopLanguageContainer {
  language?: PrestashopLanguageValue[];
}

export type PrestashopText =
  | string
  | PrestashopLanguageValue[]
  | PrestashopLanguageContainer
  | null
  | undefined;

export interface Product {
  id: number;
  id_default_image?: string | number | null;
  name: PrestashopText;
  price: string | number;
  description?: PrestashopText;
  description_short?: PrestashopText;
  associations?: {
    images?: Array<{ id: string | number }>;
  };
  imageUrl?: string;
}

export interface ProductsResponse {
  products?: Product[];
}

export interface ProductResponse {
  product?: Product;
}

export const getLocalizedText = (
  value: PrestashopText,
  fallback = 'Sin texto disponible'
): string => {
  if (!value) {
    return fallback;
  }

  if (typeof value === 'string') {
    return value.trim() || fallback;
  }

  if (Array.isArray(value)) {
    const first = value.find((item) => !!item?.value?.trim());
    return first?.value?.trim() || fallback;
  }

  if (Array.isArray(value.language)) {
    const first = value.language.find((item) => !!item?.value?.trim());
    return first?.value?.trim() || fallback;
  }

  return fallback;
};

export const getFormattedPrice = (price: string | number): string => {
  const numericPrice =
    typeof price === 'string' ? Number.parseFloat(price) : Number(price);

  if (Number.isNaN(numericPrice)) {
    return 'EUR 0.00';
  }

  return `EUR ${numericPrice.toFixed(2)}`;
};
