import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "@app/material/material.module";
import { InfrastructureModule } from "@app/infrastructure/infrastructure.module";
import { SharedModule } from "@app/shared/shared.module";

import { SigninComponent } from "@app/modules/auth/signin/signin.component";
import { AuthRoutingModule } from "./auth-routing.module";
import { AuthComponent } from "./auth.component";
import { SignupComponent } from "./signup/signup.component";

@NgModule({
  declarations: [
    AuthComponent,
    SigninComponent,
    SignupComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    AuthRoutingModule,
    InfrastructureModule,
  ],
})
export class AuthModule { }
