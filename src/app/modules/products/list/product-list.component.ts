import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { catchError, filter, finalize, mergeMap, tap } from "rxjs/operators";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { Observable, throwError } from "rxjs";
import { SubCollector } from "@app/infrastructure/core/helpers/subcollertor";
import { RouterService } from "@app/infrastructure/services/router/router.service";
import { AlertsService } from "@app/infrastructure/services/alerts/alerts.service";
import { SnackbarService } from "@app/infrastructure/services/snackbar/snackbar.service";
import { ProductViewModel } from "@app/infrastructure/interfaces/products";
import { ProductsService } from "@app/infrastructure/services/products/products.service";

@Component({
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  host: { class: "full-size" },
})
export class ProductListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public busy: boolean;
  public products: MatTableDataSource<ProductViewModel> = new MatTableDataSource<ProductViewModel>([]);
  public displayedColumns: string[] = ["SKU", "title", "vendor", "category", "description", "isActive", "price", "inventory", "deliveryTime", "actions"];


  @SubCollector()
  public subscriptions;

  constructor(
    private productsService: ProductsService,
    private routerService: RouterService,
    private alertsService: AlertsService,
    private snackbarService: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.doFetchProducts();
  }

  ngAfterViewInit(): void {
    this.products.paginator = this.paginator;
  }

  /** note: required by @SubCollector() to work correctly */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnDestroy(): void { }

  onAdd(): void {
    this.routerService.navigateToProductAdd();
  }

  onEdit(product: ProductViewModel): void {
    this.routerService.navigateToProductEdit(product.id);
  }

  onDelete(product: ProductViewModel): void {
    if (this.busy) {
      return;
    }

    this.subscriptions = this.alertsService
      .showConfirm({
        title: "Delete product",
        content: "Delete this product",
        accept: "Delete",
        cancel: "Cancel",
      })
      .pipe(
        filter(confirm => confirm),
        tap(() => (this.busy = true)),
        mergeMap(() => this.productsService.delete(product.id)),
        mergeMap(() => this.fetchProducts()),
      )
      .subscribe(() => {
        this.busy = false;
        this.snackbarService.showSnackbarSuccess("Product was deleted");
      }, () => {
        this.busy = false;
        this.snackbarService.showSnackbarFailure("Can't delete target product");
      });
  }

  private fetchProducts(): Observable<any> {
    return this.productsService
      .all(true)
      .pipe(
        tap(products => {
          this.products.data = products;
        }),
        catchError((err: any) => {
          this.snackbarService.showSnackbarFailure("An error has ocurred");
          return throwError(err);
        }),
      );
  }

  private doFetchProducts() {
    this.busy = true;
    this.subscriptions = this.fetchProducts()
      .pipe(finalize(() => (this.busy = false)))
      .subscribe();
  }
}
