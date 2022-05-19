import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { catchError, filter, finalize, mergeMap, tap } from "rxjs/operators";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { Observable, throwError } from "rxjs";
import { SubCollector } from "@app/infrastructure/core/helpers/subcollertor";
import { VendorViewModel } from "@app/infrastructure/interfaces/vendors";
import { VendorsService } from "@app/infrastructure/services/vendors/vendors.service";
import { RouterService } from "@app/infrastructure/services/router/router.service";
import { AlertsService } from "@app/infrastructure/services/alerts/alerts.service";
import { SnackbarService } from "@app/infrastructure/services/snackbar/snackbar.service";

@Component({
  templateUrl: "./vendor-list.component.html",
  styleUrls: ["./vendor-list.component.scss"],
  host: { class: "full-size" },
})
export class VendorListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public busy: boolean;
  public vendors: MatTableDataSource<VendorViewModel> = new MatTableDataSource<VendorViewModel>([]);
  public displayedColumns: string[] = ["name", "code", "actions"];

  @SubCollector()
  public subscriptions;

  constructor(
    private vendorsService: VendorsService,
    private routerService: RouterService,
    private alertsService: AlertsService,
    private snackbarService: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.doFetchVendors();
  }

  ngAfterViewInit(): void {
    this.vendors.paginator = this.paginator;
  }

  /** note: required by @SubCollector() to work correctly */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnDestroy(): void { }

  onAdd(): void {
    this.routerService.navigateToVendorAdd();
  }

  onEdit(vendor: VendorViewModel): void {
    this.routerService.navigateToVendorEdit(vendor.id);
  }

  onDelete(vendor: VendorViewModel): void {
    if (this.busy) {
      return;
    }

    this.subscriptions = this.alertsService
      .showConfirm({
        title: "Delete vendor",
        content: "Delete this vendor",
        accept: "Delete",
        cancel: "Cancel",
      })
      .pipe(
        filter(confirm => confirm),
        tap(() => (this.busy = true)),
        mergeMap(() => this.vendorsService.delete(vendor.id)),
        mergeMap(() => this.fetchVendors()),
      )
      .subscribe(() => {
        this.busy = false;
        this.snackbarService.showSnackbarSuccess("Vendor was deleted");
      }, () => {
        this.busy = false;
        this.snackbarService.showSnackbarFailure("Can't delete target vendor");
      });
  }

  private fetchVendors(): Observable<any> {
    return this.vendorsService
      .all(true)
      .pipe(
        tap(vendors => {
          this.vendors.data = vendors;
        }),
        catchError((err: any) => {
          this.snackbarService.showSnackbarFailure("An error has ocurred");
          return throwError(err);
        }),
      );
  }

  private doFetchVendors() {
    this.busy = true;
    this.subscriptions = this.fetchVendors()
      .pipe(finalize(() => (this.busy = false)))
      .subscribe();
  }
}
