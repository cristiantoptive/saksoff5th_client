import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RouterService } from "@app/infrastructure/services/router/router.service";
import { SnackbarService } from "@app/infrastructure/services/snackbar/snackbar.service";
import { UsersService } from "@app/infrastructure/services/users/users.service";

@Component({
  templateUrl: "./user-add.component.html",
  styleUrls: ["./user-add.component.scss"],
})
export class UserAddComponent {
  @ViewChild("userFormRef") userFormRef: ElementRef;

  public userForm: FormGroup;
  public isBusy = false;

  constructor(
    private formBuilder: FormBuilder,
    private routerService: RouterService,
    private usersService: UsersService,
    private snackbarService: SnackbarService,
  ) {
    this.userForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.maxLength(255), Validators.email]],
      firstName: ["", [Validators.required, Validators.maxLength(255)]],
      lastName: ["", [Validators.required, Validators.maxLength(255)]],
      password: ["", [Validators.required, Validators.maxLength(50)]],
      role: ["", [Validators.required]],
    });
  }

  doSave(): void {
    if (this.isBusy) {
      return;
    }

    this.userForm.markAllAsTouched();
    if (this.userForm.invalid || this.userForm.pending) {
      this.focusFirstInvalidInput();
      return;
    }

    this.isBusy = true;

    this.usersService.create(this.userForm.value)
      .subscribe(() => {
        this.isBusy = false;
        this.routerService.navigateToUsers();
        this.snackbarService.showSnackbarSuccess("User saved");
      }, err => {
        this.isBusy = false;
        this.snackbarService.showSnackbarFailure(err);
      });
  }

  doCancel(): void {
    this.routerService.navigateToUsers();
  }

  private focusFirstInvalidInput(): void {
    const invalidInput = this.userFormRef
      .nativeElement
      .querySelectorAll("input.ng-invalid")
      .item(0);

    if (invalidInput) {
      invalidInput.focus();
    }
  }
}
