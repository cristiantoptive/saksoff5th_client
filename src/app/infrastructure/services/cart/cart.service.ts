import { Injectable } from "@angular/core";
import { Observable, ReplaySubject } from "rxjs";
import { skip } from "rxjs/operators";
import { CartProductViewModel, ProductViewModel } from "@app/infrastructure/interfaces/products";
import { StorageService } from "@app/infrastructure/services/storage/storage.service";

const STORAGE_CART_KEY = "shopping_cart";

@Injectable({
  providedIn: "root",
})
export class CartService {
  private currentCartSubject = new ReplaySubject<CartProductViewModel[]>(1);
  private currentCartObservable = this.currentCartSubject.asObservable();

  private cartItems: CartProductViewModel[] = [];

  constructor(
    private storageService: StorageService,
  ) {
    if (this.storageService.has(STORAGE_CART_KEY)) {
      this.cartItems = this.storageService.get(STORAGE_CART_KEY) || [];
    }

    this.currentCartObservable
      .pipe(skip(1))
      .subscribe(cart => {
        this.storageService.set(STORAGE_CART_KEY, cart);
      });

    this.emitCurrentCart();
  }

  public currentCart(): Observable<CartProductViewModel[]> {
    return this.currentCartObservable;
  }

  public clearCurrentCart(): void {
    this.cartItems = [];
    this.emitCurrentCart();
  }

  public addItem(item: ProductViewModel | CartProductViewModel): void {
    const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      if (item.inventory >= (existingItem.quantity + 1)) {
        existingItem.quantity++;
      }
    } else {
      const targetItem: CartProductViewModel = JSON.parse(JSON.stringify(item));
      targetItem.quantity = 1;
      this.cartItems.push(targetItem);
    }

    this.emitCurrentCart();
  }

  public removeItem(item: ProductViewModel | CartProductViewModel): void {
    this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
    this.emitCurrentCart();
  }

  public updateItem(item: ProductViewModel | CartProductViewModel, fieldName: string, value: unknown): void {
    const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      existingItem[fieldName] = value;
      this.emitCurrentCart();
    }
  }

  private emitCurrentCart(): void {
    this.currentCartSubject.next(this.cartItems);
  }
}
