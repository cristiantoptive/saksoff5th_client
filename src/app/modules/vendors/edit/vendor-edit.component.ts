import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { SubCollector } from "@app/infrastructure/core/helpers/subcollertor";
import { VendorViewModel } from "@app/infrastructure/interfaces/vendors";
import { RouterService } from "@app/infrastructure/services/router/router.service";
import { SnackbarService } from "@app/infrastructure/services/snackbar/snackbar.service";
import { VendorsService } from "@app/infrastructure/services/vendors/vendors.service";
import { mergeMap, tap } from "rxjs/operators";

@Component({
  templateUrl: "./vendor-edit.component.html",
  styleUrls: ["./vendor-edit.component.scss"],
})
export class VendorEditComponent implements OnInit, OnDestroy {
  @ViewChild("vendorFormRef") vendorFormRef: ElementRef;

  public vendorForm: FormGroup;
  public isBusy = false;

  @SubCollector()
  public subscriptions;

  private vendor: VendorViewModel;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private routerService: RouterService,
    private vendorsService: VendorsService,
    private snackbarService: SnackbarService,
  ) {
    this.vendorForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.maxLength(200)]],
    });
  }

  ngOnInit(): void {
    this.subscriptions = this.route.params
      .pipe(
        tap(() => (this.isBusy = true)),
        mergeMap(params => this.vendorsService.one(params.id)),
      )
      .subscribe(res => {
        this.vendor = res;
        this.vendorForm.setValue({
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

    this.vendorForm.markAllAsTouched();
    if (this.vendorForm.invalid || this.vendorForm.pending) {
      this.focusFirstInvalidInput();
      return;
    }

    this.isBusy = true;

    this.vendorsService.update(this.vendor.id, this.vendorForm.value)
      .subscribe(() => {
        this.isBusy = false;
        this.routerService.navigateToVendors();
        this.snackbarService.showSnackbarSuccess("Vendor updated");
      }, err => {
        this.isBusy = false;
        this.snackbarService.showSnackbarFailure(err);
      });
  }

  doCancel(): void {
    this.routerService.navigateToVendors();
  }

  private focusFirstInvalidInput(): void {
    const invalidInput = this.vendorFormRef
      .nativeElement
      .querySelectorAll("input.ng-invalid")
      .item(0);

    if (invalidInput) {
      invalidInput.focus();
    }
  }
}
