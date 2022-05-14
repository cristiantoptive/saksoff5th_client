import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { catchError, filter, finalize, mergeMap, tap } from "rxjs/operators";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { SubCollector } from "@app/infrastructure/core/helpers/subcollertor";
import { AddressViewModel } from "@app/infrastructure/interfaces/addresses";
import { RouterService } from "@app/infrastructure/services/router/router.service";
import { AlertsService } from "@app/infrastructure/services/alerts/alerts.service";
import { SnackbarService } from "@app/infrastructure/services/snackbar/snackbar.service";
import { Observable, throwError } from "rxjs";
import { AddressesService } from "@app/infrastructure/services/addresses/addresses.service";

@Component({
  templateUrl: "./address-list.component.html",
  styleUrls: ["./address-list.component.scss"],
  host: { class: "full-size" },
})
export class AddressListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public busy: boolean;
  public addresses: MatTableDataSource<AddressViewModel> = new MatTableDataSource<AddressViewModel>([]);
  public displayedColumns: string[] = ["type", "firstName", "lastName", "line1", "line2", "city", "state", "zipcode", "country", "actions"];


  @SubCollector()
  public subscriptions;

  constructor(
    private routerService: RouterService,
    private alertsService: AlertsService,
    private snackbarService: SnackbarService,
    private addressesService: AddressesService,
  ) { }

  ngOnInit(): void {
    this.doFetchAddresses();
  }

  ngAfterViewInit(): void {
    this.addresses.paginator = this.paginator;
  }

  /** note: required by @SubCollector() to work correctly */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnDestroy(): void { }

  onAdd(): void {
    this.routerService.navigateToAddressAdd();
  }

  onEdit(address: AddressViewModel): void {
    this.routerService.navigateToAddressEdit(address.id);
  }

  onDelete(address: AddressViewModel): void {
    if (this.busy) {
      return;
    }

    this.subscriptions = this.alertsService
      .showConfirm({
        title: "Delete address",
        content: "Delete this address",
        accept: "Delete",
        cancel: "Cancel",
      })
      .pipe(
        filter(confirm => confirm),
        tap(() => (this.busy = true)),
        mergeMap(() => this.addressesService.delete(address.id)),
        mergeMap(() => this.fetchAddresses()),
      )
      .subscribe(() => {
        this.busy = false;
        this.snackbarService.showSnackbarSuccess("Address was deleted");
      }, () => {
        this.busy = false;
        this.snackbarService.showSnackbarFailure("Can't delete target address");
      });
  }

  private fetchAddresses(): Observable<any> {
    return this.addressesService
      .all()
      .pipe(
        tap(addresses => {
          this.addresses.data = addresses;
        }),
        catchError((err: any) => {
          this.snackbarService.showSnackbarFailure("An error has ocurred");
          return throwError(err);
        }),
      );
  }

  private doFetchAddresses() {
    this.busy = true;
    this.subscriptions = this.fetchAddresses()
      .pipe(finalize(() => (this.busy = false)))
      .subscribe();
  }
}
