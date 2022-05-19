import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { CartProductViewModel } from "@app/infrastructure/interfaces/products";
import { CartService } from "@app/infrastructure/services/cart/cart.service";
import { SubCollector } from "@app/infrastructure/core/helpers/subcollertor";
import { AlertsService } from "@app/infrastructure/services/alerts/alerts.service";
import { SnackbarService } from "@app/infrastructure/services/snackbar/snackbar.service";
import { RouterService } from "@app/infrastructure/services/router/router.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CardsService } from "@app/infrastructure/services/cards/cards.service";
import { AddressesService } from "@app/infrastructure/services/addresses/addresses.service";
import { zip } from "rxjs";
import { CardViewModel } from "@app/infrastructure/interfaces/cards";
import { AddressViewModel } from "@app/infrastructure/interfaces/addresses";
import { OrdersService } from "@app/infrastructure/services/orders/orders.service";

@Component({
  templateUrl: "./orders-add.component.html",
  styleUrls: ["./orders-add.component.scss"],
  host: { class: "full-size" },
})
export class OrderAddComponent implements OnInit, OnDestroy {
  @ViewChild("orderFormRef") orderFormRef: ElementRef;

  public orderForm: FormGroup;
  public isBusy: boolean;
  public products: MatTableDataSource<CartProductViewModel> = new MatTableDataSource<CartProductViewModel>([]);
  public displayedColumns: string[] = ["title", "deliveryTime", "price", "quantity", "total"];
  public footerColumns: string[] = ["title", "quantity", "total"];

  public shippingCost = 0;

  public cards: CardViewModel[];
  public addresses: AddressViewModel[];

  @SubCollector()
  public subscriptions;

  get cartSubTotal(): number {
    return this.products.data.reduce((accum, elem) => {
      return accum + (elem.price * elem.quantity);
    }, 0);
  }

  get cartTotalItems(): number {
    return this.products.data.reduce((accum, elem) => {
      return accum + elem.quantity;
    }, 0);
  }

  get cartTotal(): number {
    return this.products.data.reduce((accum, elem) => {
      return accum + (elem.price * elem.quantity);
    }, this.shippingCost);
  }

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private cardsService: CardsService,
    private ordersService: OrdersService,
    private alertsService: AlertsService,
    private routerService: RouterService,
    private snackbarService: SnackbarService,
    private addressesService: AddressesService,
  ) {
    this.orderForm = this.formBuilder.group({
      card: ["", [Validators.required]],
      shippingAddress: ["", [Validators.required]],
      billingAddress: ["", [Validators.required]],
      cvv: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.isBusy = true;

    this.subscriptions = zip(
      this.cardsService.all(),
      this.addressesService.all(),
      this.cartService.currentCart(),
    ).subscribe(([cards, addresses, products]) => {
      this.isBusy = false;
      this.cards = cards;
      this.addresses = addresses;
      this.products.data = products;
    }, err => {
      this.isBusy = false;
      this.snackbarService.showSnackbarFailure(err);
    });
  }

  /** note: required by @SubCollector() to work correctly */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnDestroy(): void { }

  doSave(): void {
    if (this.isBusy) {
      return;
    }

    this.orderForm.markAllAsTouched();
    if (this.orderForm.invalid || this.orderForm.pending) {
      this.focusFirstInvalidInput();
      return;
    }

    this.isBusy = true;

    this.ordersService.create({
      shippingAddress: this.orderForm.value.shippingAddress.id,
      billingAddress: this.orderForm.value.billingAddress.id,
      card: this.orderForm.value.card.id,
      items: this.products.data.map(product => ({
        product: product.id,
        quantity: product.quantity,
      })),
    })
      .subscribe(() => {
        this.isBusy = false;
        this.cartService.clearCurrentCart();
        this.routerService.navigateToOrders();
        this.snackbarService.showSnackbarSuccess("Order placed");
      }, err => {
        this.isBusy = false;
        this.snackbarService.showSnackbarFailure(err);
      });
  }

  private focusFirstInvalidInput(): void {
    const invalidInput = this.orderFormRef
      .nativeElement
      .querySelectorAll("input.ng-invalid")
      .item(0);

    if (invalidInput) {
      invalidInput.focus();
    }
  }
}
