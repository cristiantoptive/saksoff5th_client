import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthTokenViewModel } from "@app/infrastructure/interfaces/authentication";

import { AuthenticationService } from "@app/infrastructure/services/authentication/authentication.service";
import { SnackbarService } from "@app/infrastructure/services/snackbar/snackbar.service";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"],
  host: { class: "full-size" },
})
export class SigninComponent {
  public signinForm: FormGroup;
  public hidePassword = true;
  public busy = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private snackbarService: SnackbarService,
  ) {
    this.signinForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  public doSignin(): void {
    this.signinForm.markAllAsTouched();

    if (this.signinForm.invalid || this.signinForm.pending) {
      return;
    }

    this.busy = true;
    this.authService.signin(this.signinForm.value)
      .subscribe((res: AuthTokenViewModel) => {
        this.busy = false;
        this.snackbarService.showSnackbarSuccess(`Welcome back ${res.user.firstName} ${res.user.lastName}!`);
      }, err => {
        this.busy = false;
        this.snackbarService.showSnackbarFailure(err);
      });
  }
}
