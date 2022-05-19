import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { catchError, filter, finalize, mergeMap, tap } from "rxjs/operators";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { Observable, throwError } from "rxjs";
import { SubCollector } from "@app/infrastructure/core/helpers/subcollertor";
import { RouterService } from "@app/infrastructure/services/router/router.service";
import { AlertsService } from "@app/infrastructure/services/alerts/alerts.service";
import { SnackbarService } from "@app/infrastructure/services/snackbar/snackbar.service";
import { ProductCategoryService } from "@app/infrastructure/services/product-category/product-category.service";
import { ProductCategoryViewModel } from "@app/infrastructure/interfaces/categories";

@Component({
  templateUrl: "./category-list.component.html",
  styleUrls: ["./category-list.component.scss"],
  host: { class: "full-size" },
})
export class CategoryListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public busy: boolean;
  public categories: MatTableDataSource<ProductCategoryViewModel> = new MatTableDataSource<ProductCategoryViewModel>([]);
  public displayedColumns: string[] = ["name", "code", "actions"];

  @SubCollector()
  public subscriptions;

  constructor(
    private categoriesService: ProductCategoryService,
    private routerService: RouterService,
    private alertsService: AlertsService,
    private snackbarService: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.doFetchCategories();
  }

  ngAfterViewInit(): void {
    this.categories.paginator = this.paginator;
  }

  /** note: required by @SubCollector() to work correctly */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnDestroy(): void { }

  onAdd(): void {
    this.routerService.navigateToCategoryAdd();
  }

  onEdit(category: ProductCategoryViewModel): void {
    this.routerService.navigateToCategoryEdit(category.id);
  }

  onDelete(category: ProductCategoryViewModel): void {
    if (this.busy) {
      return;
    }

    this.subscriptions = this.alertsService
      .showConfirm({
        title: "Delete category",
        content: "Delete this category",
        accept: "Delete",
        cancel: "Cancel",
      })
      .pipe(
        filter(confirm => confirm),
        tap(() => (this.busy = true)),
        mergeMap(() => this.categoriesService.delete(category.id)),
        mergeMap(() => this.fetchCategories()),
      )
      .subscribe(() => {
        this.busy = false;
        this.snackbarService.showSnackbarSuccess("Category was deleted");
      }, () => {
        this.busy = false;
        this.snackbarService.showSnackbarFailure("Can't delete target category");
      });
  }

  private fetchCategories(): Observable<any> {
    return this.categoriesService
      .all()
      .pipe(
        tap(categories => {
          this.categories.data = categories;
        }),
        catchError((err: any) => {
          this.snackbarService.showSnackbarFailure("An error has ocurred");
          return throwError(err);
        }),
      );
  }

  private doFetchCategories() {
    this.busy = true;
    this.subscriptions = this.fetchCategories()
      .pipe(finalize(() => (this.busy = false)))
      .subscribe();
  }
}
