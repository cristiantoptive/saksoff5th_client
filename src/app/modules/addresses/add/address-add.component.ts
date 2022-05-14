import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SubCollector } from "@app/infrastructure/core/helpers/subcollertor";
import { AddressesService } from "@app/infrastructure/services/addresses/addresses.service";
import { AuthenticationService } from "@app/infrastructure/services/authentication/authentication.service";
import { RouterService } from "@app/infrastructure/services/router/router.service";
import { SnackbarService } from "@app/infrastructure/services/snackbar/snackbar.service";

@Component({
  templateUrl: "./address-add.component.html",
  styleUrls: ["./address-add.component.scss"],
})
export class AddressAddComponent implements OnInit, OnDestroy {
  @ViewChild("addressFormRef") addressFormRef: ElementRef;

  public addressForm: FormGroup;
  public isBusy = false;

  @SubCollector()
  public subscriptions;

  constructor(
    private formBuilder: FormBuilder,
    private routerService: RouterService,
    private snackbarService: SnackbarService,
    private addressesService: AddressesService,
    private authenticationService: AuthenticationService,
  ) {
    this.addressForm = this.formBuilder.group({
      firstName: ["", [Validators.required, Validators.maxLength(255)]],
      lastName: ["", [Validators.required, Validators.maxLength(255)]],
      line1: ["", [Validators.required, Validators.maxLength(255)]],
      line2: ["", [Validators.maxLength(255)]],
      city: ["", [Validators.required, Validators.maxLength(255)]],
      state: ["", [Validators.required, Validators.maxLength(255)]],
      zipcode: ["", [Validators.required, Validators.maxLength(255)]],
      country: ["", [Validators.required, Validators.maxLength(255)]],
      type: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.isBusy = true;
    this.subscriptions = this.authenticationService
      .currentUser()
      .subscribe(user => {
        this.addressForm.controls.firstName.setValue(user.firstName);
        this.addressForm.controls.lastName.setValue(user.lastName);
        this.isBusy = false;
      });
  }

  /** note: required by @SubCollector() to work correctly */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnDestroy(): void { }

  doSave(): void {
    if (this.isBusy) {
      return;
    }

    this.addressForm.markAllAsTouched();
    if (this.addressForm.invalid || this.addressForm.pending) {
      this.focusFirstInvalidInput();
      return;
    }

    this.isBusy = true;

    this.addressesService.create(this.addressForm.value)
      .subscribe(() => {
        this.isBusy = false;
        this.routerService.navigateToAddresses();
        this.snackbarService.showSnackbarSuccess("Address saved");
      }, err => {
        this.isBusy = false;
        this.snackbarService.showSnackbarFailure(err);
      });
  }

  doCancel(): void {
    this.routerService.navigateToAddresses();
  }

  private focusFirstInvalidInput(): void {
    const invalidInput = this.addressFormRef
      .nativeElement
      .querySelectorAll("input.ng-invalid")
      .item(0);

    if (invalidInput) {
      invalidInput.focus();
    }
  }
}
