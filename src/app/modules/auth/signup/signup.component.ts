import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AuthTokenViewModel } from "@app/infrastructure/interfaces/authentication";
import { AuthenticationService } from "@app/infrastructure/services/authentication/authentication.service";
import { SnackbarService } from "@app/infrastructure/services/snackbar/snackbar.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
  host: { class: "full-size" },
})
export class SignupComponent {
  public signupForm: FormGroup;
  public hidePassword = true;
  public busy = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private snackbarService: SnackbarService,
  ) {
    this.signupForm = this.formBuilder.group({
      firstName: ["", [Validators.required, Validators.maxLength(255)]],
      lastName: ["", [Validators.required, Validators.maxLength(255)]],
      email: ["", [Validators.required, Validators.email, Validators.maxLength(255)]],
      password: ["", [Validators.required, Validators.maxLength(50)]],
    });
  }

  public doSignup(): void {
    this.signupForm.markAllAsTouched();

    if (this.signupForm.invalid || this.signupForm.pending) {
      return;
    }

    this.busy = true;
    this.authService.signup(this.signupForm.value)
      .subscribe((res: AuthTokenViewModel) => {
        this.busy = false;
        this.snackbarService.showSnackbarSuccess(`Welcome ${res.user.firstName} ${res.user.lastName}!`);
      }, err => {
        this.busy = false;
        this.snackbarService.showSnackbarFailure(err);
      });
  }
}
