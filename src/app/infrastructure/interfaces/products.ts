import { ProductCategoryViewModel } from "./categories";
import { UploadViewModel } from "./uploads";
import { VendorViewModel } from "./vendors";

export interface ProductViewModel {
  id: string;
  SKU: string;
  title: string;
  description: string;
  price: number;
  inventory: number;
  deliveryTime: number;
  isActive: boolean;
  vendor: VendorViewModel;
  category: ProductCategoryViewModel;
  images: UploadViewModel[];
}

export interface CartProductViewModel extends ProductViewModel {
  quantity: number;
}

export interface ProductCommand {
  SKU: string;
  title: string;
  description: string;
  price: number;
  inventory: number;
  deliveryTime: string;
  isActive: boolean;
  vendor: string;
  category: string;
}
