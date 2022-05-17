import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatSelectChange } from "@angular/material/select";
import { SubCollector } from "@app/infrastructure/core/helpers/subcollertor";
import { ProductCategoryViewModel } from "@app/infrastructure/interfaces/categories";
import { ProductViewModel } from "@app/infrastructure/interfaces/products";
import { VendorViewModel } from "@app/infrastructure/interfaces/vendors";
import { AlertsService } from "@app/infrastructure/services/alerts/alerts.service";
import { CartService } from "@app/infrastructure/services/cart/cart.service";
import { ProductCategoryService } from "@app/infrastructure/services/product-category/product-category.service";
import { ProductsService } from "@app/infrastructure/services/products/products.service";
import { RouterService } from "@app/infrastructure/services/router/router.service";
import { SnackbarService } from "@app/infrastructure/services/snackbar/snackbar.service";
import { VendorsService } from "@app/infrastructure/services/vendors/vendors.service";
import { Observable, of, Subscription, throwError, zip } from "rxjs";
import { tap, catchError, finalize, delay, mergeMap } from "rxjs/operators";

@Component({
  templateUrl: "./catalog-list.component.html",
  styleUrls: ["./catalog-list.component.scss"],
})
export class CatalogListComponent implements OnInit, OnDestroy {
  public isBusy: boolean;

  public products: ProductViewModel[];
  public vendors: VendorViewModel[];
  public categories: ProductCategoryViewModel[];

  public selectedCategory: any;
  public selectedVendor: any;
  public searchText: string;

  public slides = [
    "https://material.angular.io/assets/img/examples/shiba2.jpg",
    "https://material.angular.io/assets/img/examples/shiba2.jpg",
    "https://material.angular.io/assets/img/examples/shiba2.jpg",
  ];

  @SubCollector()
  public subscriptions;

  private searchSubscription: Subscription;

  constructor(
    private cartService: CartService,
    private routerService: RouterService,
    private alertsService: AlertsService,
    private vendorService: VendorsService,
    private productService: ProductsService,
    private snackbarService: SnackbarService,
    private categoriesService: ProductCategoryService,
  ) {
  }

  ngOnInit(): void {
    this.isBusy = true;

    this.subscriptions = zip(
      this.fetchProducts(),
      this.categoriesService.all(),
      this.vendorService.all(),
    )
      .subscribe(([products, categories, vendors]) => {
        this.products = products;
        this.vendors = vendors;
        this.categories = categories;
        this.isBusy = false;
      }, err => {
        this.isBusy = false;
        this.snackbarService.showSnackbarFailure(err);
      });
  }

  /** note: required by @SubCollector() to work correctly */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnDestroy(): void { }

  onSearchCategoryChange($event: MatSelectChange): void {
    this.selectedCategory = $event.value;
    this.doFetchProducts();
  }

  onSearchVendorChange($event: MatSelectChange): void {
    this.selectedVendor = $event.value;
    this.doFetchProducts();
  }

  onSearchTextChange(search: string): void {
    this.searchText = search;
    this.doFetchProducts();
  }

  onClearSearch(): void {
    this.searchText = "";
    this.selectedVendor = [];
    this.selectedCategory = [];
    this.doFetchProducts(true);
  }

  onAddToCart(product: ProductViewModel): void {
    this.cartService.addItem(product);
    this.alertsService
      .showConfirm({
        title: "Success",
        content: "Your product has been added to the cart",
        accept: "View your cart",
        cancel: "View more products",
      })
      .subscribe(res => {
        if (res) {
          this.routerService.navigateToCart();
        }
      });
  }

  onBuyProduct(product: ProductViewModel): void {
    this.cartService.addItem(product);
    this.routerService.navigateToCart();
  }

  private doFetchProducts(inmediate = false) {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }

    this.searchSubscription = of(null)
      .pipe(
        delay(inmediate ? 0 : 500),
        tap(() => (this.isBusy = true)),
        mergeMap(() => this.fetchProducts()),
        finalize(() => (this.isBusy = false)),
      )
      .subscribe();
  }

  private fetchProducts(): Observable<any> {
    return this.productService
      .all(
        false,
        this.searchText,
        (this.selectedCategory || []).map(category => category.id),
        (this.selectedVendor || []).map(vendor => vendor.id),
      )
      .pipe(
        tap(products => {
          this.products = products;
        }),
        catchError((err: any) => {
          this.snackbarService.showSnackbarFailure("An error has ocurred");
          return throwError(err);
        }),
      );
  }
}
