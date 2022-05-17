import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { filter, tap } from "rxjs/operators";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { CartProductViewModel } from "@app/infrastructure/interfaces/products";
import { CartService } from "@app/infrastructure/services/cart/cart.service";
import { SubCollector } from "@app/infrastructure/core/helpers/subcollertor";
import { AlertsService } from "@app/infrastructure/services/alerts/alerts.service";
import { SnackbarService } from "@app/infrastructure/services/snackbar/snackbar.service";
import { RouterService } from "@app/infrastructure/services/router/router.service";

@Component({
  templateUrl: "./my-cart.component.html",
  styleUrls: ["./my-cart.component.scss"],
  host: { class: "full-size" },
})
export class MyCartComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public busy: boolean;
  public products: MatTableDataSource<CartProductViewModel> = new MatTableDataSource<CartProductViewModel>([]);
  public displayedColumns: string[] = ["title", "deliveryTime", "price", "quantity", "total", "actions"];

  public showPaginator = false;

  public shippingCost = 0;

  @SubCollector()
  public subscriptions;

  get cartSubTotal(): number {
    return this.products.data.reduce((accum, elem) => {
      return accum + (elem.price * elem.quantity);
    }, 0);
  }

  get cartTotal(): number {
    return this.products.data.reduce((accum, elem) => {
      return accum + (elem.price * elem.quantity);
    }, this.shippingCost);
  }

  constructor(
    private cartService: CartService,
    private alertsService: AlertsService,
    private routerService: RouterService,
    private snackbarService: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.subscriptions = this.cartService
      .currentCart()
      .subscribe(products => {
        this.products.data = products;
      });
  }

  ngAfterViewInit(): void {
    if (this.showPaginator) {
      this.products.paginator = this.paginator;
    }
  }

  /** note: required by @SubCollector() to work correctly */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnDestroy(): void { }

  onAdd(): void {
    this.routerService.navigateToMain();
  }

  onDelete(element: CartProductViewModel): void {
    this.subscriptions = this.alertsService
      .showConfirm({
        title: "Remove product",
        content: "Remove this product from your cart",
        accept: "Remove",
        cancel: "Cancel",
      })
      .pipe(
        filter(confirm => confirm),
        tap(() => this.cartService.removeItem(element)),
      )
      .subscribe(() => {
        this.snackbarService.showSnackbarSuccess("Product was removed");
      }, () => {
        this.snackbarService.showSnackbarFailure("Can't remove target product");
      });
  }

  decreaseQuantity(element: CartProductViewModel): void {
    if (element.quantity > 1) {
      this.cartService.updateItem(element, "quantity", element.quantity - 1);
    }
  }

  increaseQuantity(element: CartProductViewModel): void {
    if (element.quantity + 1 <= element.inventory) {
      this.cartService.updateItem(element, "quantity", element.quantity + 1);
    }
  }

  confirmPurchase(): void {
    this.routerService.navigateToOrderAdd();
  }
}
