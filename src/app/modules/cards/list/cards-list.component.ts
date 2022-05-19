import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { catchError, filter, finalize, mergeMap, tap } from "rxjs/operators";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { Observable, throwError } from "rxjs";
import { SubCollector } from "@app/infrastructure/core/helpers/subcollertor";
import { RouterService } from "@app/infrastructure/services/router/router.service";
import { AlertsService } from "@app/infrastructure/services/alerts/alerts.service";
import { SnackbarService } from "@app/infrastructure/services/snackbar/snackbar.service";
import { CardViewModel } from "@app/infrastructure/interfaces/cards";
import { CardsService } from "@app/infrastructure/services/cards/cards.service";

@Component({
  templateUrl: "./cards-list.component.html",
  styleUrls: ["./cards-list.component.scss"],
  host: { class: "full-size" },
})
export class CardListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public busy: boolean;
  public cards: MatTableDataSource<CardViewModel> = new MatTableDataSource<CardViewModel>([]);
  public displayedColumns: string[] = ["name", "number", "expiresOn", "actions"];


  @SubCollector()
  public subscriptions;

  constructor(
    private cardsService: CardsService,
    private routerService: RouterService,
    private alertsService: AlertsService,
    private snackbarService: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.doFetchCards();
  }

  ngAfterViewInit(): void {
    this.cards.paginator = this.paginator;
  }

  /** note: required by @SubCollector() to work correctly */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnDestroy(): void { }

  onAdd(): void {
    this.routerService.navigateToCardAdd();
  }

  onEdit(address: CardViewModel): void {
    this.routerService.navigateToCardEdit(address.id);
  }

  onDelete(address: CardViewModel): void {
    if (this.busy) {
      return;
    }

    this.subscriptions = this.alertsService
      .showConfirm({
        title: "Delete card",
        content: "Delete this card",
        accept: "Delete",
        cancel: "Cancel",
      })
      .pipe(
        filter(confirm => confirm),
        tap(() => (this.busy = true)),
        mergeMap(() => this.cardsService.delete(address.id)),
        mergeMap(() => this.fetchCards()),
      )
      .subscribe(() => {
        this.busy = false;
        this.snackbarService.showSnackbarSuccess("Card was deleted");
      }, () => {
        this.busy = false;
        this.snackbarService.showSnackbarFailure("Can't delete target card");
      });
  }

  private fetchCards(): Observable<any> {
    return this.cardsService
      .all()
      .pipe(
        tap(cards => {
          this.cards.data = cards;
        }),
        catchError((err: any) => {
          this.snackbarService.showSnackbarFailure("An error has ocurred");
          return throwError(err);
        }),
      );
  }

  private doFetchCards() {
    this.busy = true;
    this.subscriptions = this.fetchCards()
      .pipe(finalize(() => (this.busy = false)))
      .subscribe();
  }
}
