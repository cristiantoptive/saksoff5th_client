import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AuthenticationService } from "@app/infrastructure/services/authentication/authentication.service";
import { SnackbarService } from "@app/infrastructure/services/snackbar/snackbar.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  host: { class: "full-size" },
})
export class LoginComponent {
  public loginForm: FormGroup;
  public hidePassword = true;
  public busy = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private snackbarService: SnackbarService,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  public doLogin(): void {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid || this.loginForm.pending) {
      return;
    }

    this.busy = true;
    this.authService.sigin(this.loginForm.value)
      .subscribe(() => {
        this.busy = false;
        this.snackbarService.showSnackbarSuccess("Welcome back!");
      }, err => {
        this.busy = false;
        this.snackbarService.showSnackbarFailure(err);
      });
  }
}
