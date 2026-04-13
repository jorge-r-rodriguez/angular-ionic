import { Product } from '../models/product';
import { PrestashopProductDto, PrestashopText } from '../models/prestashop-product';

const DEFAULT_NAME = 'Producto sin nombre';
const DEFAULT_DESCRIPTION = 'No hay descripcion disponible para este producto.';

export const mapPrestashopProduct = (
  product: PrestashopProductDto,
  buildImageUrl: (productId: number, imageId: string | number) => string
): Product => {
  const id = Number(product.id);
  const imageId = getProductImageId(product);

  return {
    id,
    name: getLocalizedText(product.name, DEFAULT_NAME),
    price: parsePrice(product.price),
    priceLabel: formatPrice(product.price),
    descriptionHtml: getLocalizedText(
      product.description ?? product.description_short,
      DEFAULT_DESCRIPTION
    ),
    imageUrl: imageId ? buildImageUrl(id, imageId) : undefined,
  };
};

const getProductImageId = (
  product: PrestashopProductDto
): string | number | null => {
  if (product.id_default_image) {
    return product.id_default_image;
  }

  return product.associations?.images?.[0]?.id ?? null;
};

const getLocalizedText = (
  value: PrestashopText,
  fallback: string
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

const parsePrice = (price: string | number): number => {
  const numericPrice =
    typeof price === 'string' ? Number.parseFloat(price) : Number(price);

  return Number.isNaN(numericPrice) ? 0 : numericPrice;
};

const formatPrice = (price: string | number): string => {
  return `EUR ${parsePrice(price).toFixed(2)}`;
};
