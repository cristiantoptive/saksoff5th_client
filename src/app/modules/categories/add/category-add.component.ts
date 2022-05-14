import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ProductCategoryService } from "@app/infrastructure/services/product-category/product-category.service";
import { RouterService } from "@app/infrastructure/services/router/router.service";
import { SnackbarService } from "@app/infrastructure/services/snackbar/snackbar.service";

@Component({
  templateUrl: "./category-add.component.html",
  styleUrls: ["./category-add.component.scss"],
})
export class CategoryAddComponent {
  @ViewChild("categoryFormRef") categoryFormRef: ElementRef;

  public categoryForm: FormGroup;
  public isBusy = false;

  constructor(
    private formBuilder: FormBuilder,
    private routerService: RouterService,
    private categoriesService: ProductCategoryService,
    private snackbarService: SnackbarService,
  ) {
    this.categoryForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.maxLength(200)]],
    });
  }

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

    this.categoriesService.create(this.categoryForm.value)
      .subscribe(() => {
        this.isBusy = false;
        this.routerService.navigateToCategories();
        this.snackbarService.showSnackbarSuccess("Category saved");
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
