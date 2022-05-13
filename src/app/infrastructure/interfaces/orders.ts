import { AddressViewModel } from "./addresses";
import { CardViewModel } from "./cards";
import { ProductViewModel } from "./products";

export interface OrderItemViewModel {
  id: string;
  price: number;
  quantity: number;
  product: ProductViewModel;
}

export interface OrderViewModel {
  id: string;
  status: string;
  shippingAddress: AddressViewModel;
  billingAddress: AddressViewModel;
  paymentCard: CardViewModel;
  items: OrderItemViewModel[];
}

export interface OrderItemCommand {
  product: string;
  quantity: number;
}

export interface OrderCommand {
  shippingAddress: string;
  billingAddress: string;
  card: string;
  items: OrderItemCommand[];
}
