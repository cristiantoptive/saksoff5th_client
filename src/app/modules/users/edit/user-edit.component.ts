import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { SubCollector } from "@app/infrastructure/core/helpers/subcollertor";
import { UserViewModel } from "@app/infrastructure/interfaces/users";
import { AuthenticationService } from "@app/infrastructure/services/authentication/authentication.service";
import { RouterService } from "@app/infrastructure/services/router/router.service";
import { SnackbarService } from "@app/infrastructure/services/snackbar/snackbar.service";
import { UsersService } from "@app/infrastructure/services/users/users.service";
import { zip } from "rxjs";
import { first, mergeMap, tap } from "rxjs/operators";

@Component({
  templateUrl: "./user-edit.component.html",
  styleUrls: ["./user-edit.component.scss"],
})
export class UserEditComponent implements OnInit, OnDestroy {
  @ViewChild("userFormRef") userFormRef: ElementRef;

  public userForm: FormGroup;
  public isBusy = false;

  @SubCollector()
  public subscriptions;

  private user: UserViewModel;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private routerService: RouterService,
    private usersService: UsersService,
    private snackbarService: SnackbarService,
    private authenticationService: AuthenticationService,
  ) {
    this.userForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.maxLength(255), Validators.email]],
      firstName: ["", [Validators.required, Validators.maxLength(255)]],
      lastName: ["", [Validators.required, Validators.maxLength(255)]],
      password: ["", [Validators.maxLength(50)]],
      role: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.subscriptions = this.route.params
      .pipe(
        tap(() => (this.isBusy = true)),
        mergeMap(params => zip(
          this.usersService.one(params.id),
          this.authenticationService.currentUser().pipe(first()),
        )),
      )
      .subscribe(([res, currentUser]: [UserViewModel, UserViewModel]) => {
        this.user = res;
        this.userForm.setValue({
          email: res.email,
          firstName: res.firstName,
          lastName: res.lastName,
          role: res.role,
          password: "",
        });

        if (currentUser.id === res.id) {
          this.userForm.controls.role.disable();
        }

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

    this.userForm.markAllAsTouched();
    if (this.userForm.invalid || this.userForm.pending) {
      this.focusFirstInvalidInput();
      return;
    }

    this.isBusy = true;

    this.usersService.update(this.user.id, this.userForm.value)
      .subscribe(() => {
        this.isBusy = false;
        this.routerService.navigateToUsers();
        this.snackbarService.showSnackbarSuccess("User updated");
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
