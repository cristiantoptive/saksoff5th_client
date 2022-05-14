import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { zip } from "rxjs";
import { mergeMap, tap } from "rxjs/operators";
import { SubCollector } from "@app/infrastructure/core/helpers/subcollertor";
import { ProductCategoryViewModel } from "@app/infrastructure/interfaces/categories";
import { ProductViewModel } from "@app/infrastructure/interfaces/products";
import { VendorViewModel } from "@app/infrastructure/interfaces/vendors";
import { ProductCategoryService } from "@app/infrastructure/services/product-category/product-category.service";
import { ProductsService } from "@app/infrastructure/services/products/products.service";
import { RouterService } from "@app/infrastructure/services/router/router.service";
import { SnackbarService } from "@app/infrastructure/services/snackbar/snackbar.service";
import { VendorsService } from "@app/infrastructure/services/vendors/vendors.service";

@Component({
  templateUrl: "./product-edit.component.html",
  styleUrls: ["./product-edit.component.scss"],
})
export class ProductEditComponent implements OnInit, OnDestroy {
  @ViewChild("productFormRef") productFormRef: ElementRef;

  public productForm: FormGroup;
  public isBusy = false;

  public vendors: VendorViewModel[];
  public categories: ProductCategoryViewModel[];

  @SubCollector()
  public subscriptions;

  private product: ProductViewModel;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private routerService: RouterService,
    private vendorsServie: VendorsService,
    private productsService: ProductsService,
    private snackbarService: SnackbarService,
    private categoriesService: ProductCategoryService,
  ) {
    this.productForm = this.formBuilder.group({
      SKU: ["", [Validators.required, Validators.maxLength(255)]],
      title: ["", [Validators.required, Validators.maxLength(255)]],
      description: ["", []],
      price: ["", [Validators.required, Validators.min(0.01)]],
      inventory: ["", [Validators.required, Validators.min(1)]],
      deliveryTime: ["", [Validators.required, Validators.maxLength(255)]],
      isActive: ["", [Validators.required]],
      vendor: ["", [Validators.required]],
      category: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.isBusy = true;

    this.subscriptions = zip(
      this.vendorsServie.all(true),
      this.categoriesService.all(),
    )
      .pipe(
        tap(([vendors, categories]: [VendorViewModel[], ProductCategoryViewModel[]]) => {
          this.vendors = vendors;
          this.categories = categories;
        }),
        mergeMap(() => this.route.params),
        tap(() => (this.isBusy = true)),
        mergeMap(params => this.productsService.one(params.id)),
      )
      .subscribe(res => {
        this.product = res;
        this.productForm.setValue({
          SKU: res.SKU,
          title: res.title,
          description: res.description,
          price: res.price,
          inventory: res.inventory,
          deliveryTime: res.deliveryTime,
          isActive: res.isActive,
          vendor: res.vendor ? res.vendor.id : "",
          category: res.category ? res.category.id : "",
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

    this.productForm.markAllAsTouched();
    if (this.productForm.invalid || this.productForm.pending) {
      this.focusFirstInvalidInput();
      return;
    }

    this.isBusy = true;

    this.productsService.update(this.product.id, this.productForm.value)
      .subscribe(() => {
        this.isBusy = false;
        this.routerService.navigateToProducts();
        this.snackbarService.showSnackbarSuccess("Product updated");
      }, err => {
        this.isBusy = false;
        this.snackbarService.showSnackbarFailure(err);
      });
  }

  doCancel(): void {
    this.routerService.navigateToProducts();
  }

  private focusFirstInvalidInput(): void {
    const invalidInput = this.productFormRef
      .nativeElement
      .querySelectorAll("input.ng-invalid")
      .item(0);

    if (invalidInput) {
      invalidInput.focus();
    }
  }
}
