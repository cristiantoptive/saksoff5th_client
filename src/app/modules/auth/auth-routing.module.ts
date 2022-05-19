import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "./auth.component";
import { AuthenticationGuard, AuthenticationModes } from "@app/infrastructure/services/authentication/authentication.guard";
import { SigninComponent } from "./signin/signin.component";
import { SignupComponent } from "./signup/signup.component";

const routes: Routes = [{
  path: "",
  component: AuthComponent,
  children: [
    {
      path: "signin",
      component: SigninComponent,
      canActivate: [AuthenticationGuard],
      data: {
        authMode: AuthenticationModes.NOT_LOGGED_IN,
        reuse: false,
      },
    },
    {
      path: "signup",
      component: SignupComponent,
      canActivate: [AuthenticationGuard],
      data: {
        authMode: AuthenticationModes.NOT_LOGGED_IN,
        reuse: false,
      },
    },
    {
      path: "",
      redirectTo: "/",
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }
