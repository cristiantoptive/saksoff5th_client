import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { catchError, filter, finalize, mergeMap, tap } from "rxjs/operators";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { Observable, throwError } from "rxjs";
import { SubCollector } from "@app/infrastructure/core/helpers/subcollertor";
import { RouterService } from "@app/infrastructure/services/router/router.service";
import { AlertsService } from "@app/infrastructure/services/alerts/alerts.service";
import { SnackbarService } from "@app/infrastructure/services/snackbar/snackbar.service";
import { OrderViewModel } from "@app/infrastructure/interfaces/orders";
import { OrdersService } from "@app/infrastructure/services/orders/orders.service";

@Component({
  templateUrl: "./orders-list.component.html",
  styleUrls: ["./orders-list.component.scss"],
  host: { class: "full-size" },
})
export class OrderListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public busy: boolean;
  public orders: MatTableDataSource<OrderViewModel> = new MatTableDataSource<OrderViewModel>([]);
  public displayedColumns: string[] = ["items", "payment", "billing", "shipping", "status", "total", "actions"];


  @SubCollector()
  public subscriptions;

  constructor(
    private routerService: RouterService,
    private alertsService: AlertsService,
    private snackbarService: SnackbarService,
    private ordersService: OrdersService,
  ) { }

  ngOnInit(): void {
    this.doFetchOrders();
  }

  ngAfterViewInit(): void {
    this.orders.paginator = this.paginator;
  }

  /** note: required by @SubCollector() to work correctly */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnDestroy(): void { }

  onAdd(): void {
    this.routerService.navigateToCart();
  }

  onDelete(order: OrderViewModel): void {
    if (this.busy) {
      return;
    }

    this.subscriptions = this.alertsService
      .showConfirm({
        title: "Cancel order",
        content: "Cancel this order",
        accept: "Confirm",
        cancel: "Cancel",
      })
      .pipe(
        filter(confirm => confirm),
        tap(() => (this.busy = true)),
        mergeMap(() => this.ordersService.delete(order.id)),
        mergeMap(() => this.fetchOrders()),
      )
      .subscribe(() => {
        this.busy = false;
        this.snackbarService.showSnackbarSuccess("Order was cancelled");
      }, () => {
        this.busy = false;
        this.snackbarService.showSnackbarFailure("Can't cancel target order");
      });
  }

  getTotal(order: OrderViewModel): number {
    return (order.items || []).reduce((accum, item) => {
      return accum + item.price;
    }, 0);
  }

  private fetchOrders(): Observable<any> {
    return this.ordersService
      .all()
      .pipe(
        tap(orders => {
          this.orders.data = orders;
        }),
        catchError((err: any) => {
          this.snackbarService.showSnackbarFailure("An error has ocurred");
          return throwError(err);
        }),
      );
  }

  private doFetchOrders() {
    this.busy = true;
    this.subscriptions = this.fetchOrders()
      .pipe(finalize(() => (this.busy = false)))
      .subscribe();
  }
}
