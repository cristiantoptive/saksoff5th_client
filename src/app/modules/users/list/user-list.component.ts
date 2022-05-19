import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { catchError, filter, finalize, mergeMap, tap } from "rxjs/operators";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { Observable, throwError } from "rxjs";
import { SubCollector } from "@app/infrastructure/core/helpers/subcollertor";
import { RouterService } from "@app/infrastructure/services/router/router.service";
import { AlertsService } from "@app/infrastructure/services/alerts/alerts.service";
import { SnackbarService } from "@app/infrastructure/services/snackbar/snackbar.service";
import { UserViewModel } from "@app/infrastructure/interfaces/users";
import { UsersService } from "@app/infrastructure/services/users/users.service";

@Component({
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
  host: { class: "full-size" },
})
export class UserListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public busy: boolean;
  public users: MatTableDataSource<UserViewModel> = new MatTableDataSource<UserViewModel>([]);
  public displayedColumns: string[] = ["role", "email", "firstName", "lastName", "actions"];

  @SubCollector()
  public subscriptions;

  constructor(
    private usersService: UsersService,
    private routerService: RouterService,
    private alertsService: AlertsService,
    private snackbarService: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.doFetchUsers();
  }

  ngAfterViewInit(): void {
    this.users.paginator = this.paginator;
  }

  /** note: required by @SubCollector() to work correctly */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnDestroy(): void { }

  onAdd(): void {
    this.routerService.navigateToUserAdd();
  }

  onEdit(user: UserViewModel): void {
    this.routerService.navigateToUserEdit(user.id);
  }

  onDelete(user: UserViewModel): void {
    if (this.busy) {
      return;
    }

    this.subscriptions = this.alertsService
      .showConfirm({
        title: "Delete user",
        content: "Delete this user",
        accept: "Delete",
        cancel: "Cancel",
      })
      .pipe(
        filter(confirm => confirm),
        tap(() => (this.busy = true)),
        mergeMap(() => this.usersService.delete(user.id)),
        mergeMap(() => this.fetchUsers()),
      )
      .subscribe(() => {
        this.busy = false;
        this.snackbarService.showSnackbarSuccess("User was deleted");
      }, () => {
        this.busy = false;
        this.snackbarService.showSnackbarFailure("Can't delete target user");
      });
  }

  private fetchUsers(): Observable<any> {
    return this.usersService
      .all()
      .pipe(
        tap((users: UserViewModel[]) => {
          this.users.data = users;
        }),
        catchError((err: any) => {
          this.snackbarService.showSnackbarFailure("An error has ocurred");
          return throwError(err);
        }),
      );
  }

  private doFetchUsers() {
    this.busy = true;
    this.subscriptions = this.fetchUsers()
      .pipe(finalize(() => (this.busy = false)))
      .subscribe();
  }
}
