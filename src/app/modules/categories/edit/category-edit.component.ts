import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { SubCollector } from "@app/infrastructure/core/helpers/subcollertor";
import { ProductCategoryViewModel } from "@app/infrastructure/interfaces/categories";
import { ProductCategoryService } from "@app/infrastructure/services/product-category/product-category.service";
import { RouterService } from "@app/infrastructure/services/router/router.service";
import { SnackbarService } from "@app/infrastructure/services/snackbar/snackbar.service";
import { mergeMap, tap } from "rxjs/operators";

@Component({
  templateUrl: "./category-edit.component.html",
  styleUrls: ["./category-edit.component.scss"],
})
export class CategoryEditComponent implements OnInit, OnDestroy {
  @ViewChild("categoryFormRef") categoryFormRef: ElementRef;

  public categoryForm: FormGroup;
  public isBusy = false;

  @SubCollector()
  public subscriptions;

  private category: ProductCategoryViewModel;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private routerService: RouterService,
    private snackbarService: SnackbarService,
    private categoriesService: ProductCategoryService,
  ) {
    this.categoryForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.maxLength(200)]],
    });
  }

  ngOnInit(): void {
    this.subscriptions = this.route.params
      .pipe(
        tap(() => (this.isBusy = true)),
        mergeMap(params => this.categoriesService.one(params.id)),
      )
      .subscribe(res => {
        this.category = res;
        this.categoryForm.setValue({
          name: res.name,
        });
        this.isBusy = false;
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

    this.categoryForm.markAllAsTouched();
    if (this.categoryForm.invalid || this.categoryForm.pending) {
      this.focusFirstInvalidInput();
      return;
    }

    this.isBusy = true;

    this.categoriesService.update(this.category.id, this.categoryForm.value)
      .subscribe(() => {
        this.isBusy = false;
        this.routerService.navigateToCategories();
        this.snackbarService.showSnackbarSuccess("Category updated");
      }, err => {
        this.isBusy = false;
        this.snackbarService.showSnackbarFailure(err);
      });
  }

  doCancel(): void {
    this.routerService.navigateToCategories();
  }

  private focusFirstInvalidInput(): void {
    const invalidInput = this.categoryFormRef
      .nativeElement
      .querySelectorAll("input.ng-invalid")
      .item(0);

    if (invalidInput) {
      invalidInput.focus();
    }
  }
}
