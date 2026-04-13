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

export interface PrestashopProductDto {
  id: number | string;
  id_default_image?: string | number | null;
  name: PrestashopText;
  price: string | number;
  description?: PrestashopText;
  description_short?: PrestashopText;
  associations?: {
    images?: Array<{ id: string | number }>;
  };
}

export interface ProductsResponseDto {
  products?: PrestashopProductDto[];
}

export interface ProductResponseDto {
  product?: PrestashopProductDto;
}
