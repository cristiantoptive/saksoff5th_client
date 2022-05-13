import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RouterService } from "@app/infrastructure/services/router/router.service";
import { SnackbarService } from "@app/infrastructure/services/snackbar/snackbar.service";
import { VendorsService } from "@app/infrastructure/services/vendors/vendors.service";

@Component({
  templateUrl: "./vendor-add.component.html",
  styleUrls: ["./vendor-add.component.scss"],
})
export class VendorAddComponent {
  @ViewChild("vendorFormRef") vendorFormRef: ElementRef;

  public vendorForm: FormGroup;
  public isBusy = false;

  constructor(
    private formBuilder: FormBuilder,
    private routerService: RouterService,
    private vendorsService: VendorsService,
    private snackbarService: SnackbarService,
  ) {
    this.vendorForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.maxLength(200)]],
    });
  }

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

    this.vendorsService.create(this.vendorForm.value)
      .subscribe(() => {
        this.isBusy = false;
        this.routerService.navigateToVendors();
        this.snackbarService.showSnackbarSuccess("Vendor saved");
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
