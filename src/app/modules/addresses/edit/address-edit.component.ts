import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { tap, mergeMap } from "rxjs/operators";
import { SubCollector } from "@app/infrastructure/core/helpers/subcollertor";
import { AddressViewModel } from "@app/infrastructure/interfaces/addresses";
import { AddressesService } from "@app/infrastructure/services/addresses/addresses.service";
import { RouterService } from "@app/infrastructure/services/router/router.service";
import { SnackbarService } from "@app/infrastructure/services/snackbar/snackbar.service";

@Component({
  templateUrl: "./address-edit.component.html",
  styleUrls: ["./address-edit.component.scss"],
})
export class AddressEditComponent implements OnInit, OnDestroy {
  @ViewChild("addressFormRef") addressFormRef: ElementRef;

  public addressForm: FormGroup;
  public isBusy = false;

  @SubCollector()
  public subscriptions;

  private address: AddressViewModel;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private routerService: RouterService,
    private snackbarService: SnackbarService,
    private addressesService: AddressesService,
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
    this.subscriptions = this.route.params
      .pipe(
        tap(() => (this.isBusy = true)),
        mergeMap(params => this.addressesService.one(params.id)),
      )
      .subscribe(res => {
        this.address = res;
        this.addressForm.setValue({
          firstName: res.firstName,
          lastName: res.lastName,
          line1: res.line1,
          line2: res.line2,
          city: res.city,
          state: res.state,
          zipcode: res.zipcode,
          country: res.country,
          type: res.type,
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

    this.addressForm.markAllAsTouched();
    if (this.addressForm.invalid || this.addressForm.pending) {
      this.focusFirstInvalidInput();
      return;
    }

    this.isBusy = true;

    this.addressesService.update(this.address.id, this.addressForm.value)
      .subscribe(() => {
        this.isBusy = false;
        this.routerService.navigateToAddresses();
        this.snackbarService.showSnackbarSuccess("Address updated");
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
