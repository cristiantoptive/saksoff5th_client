import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MaterialModule } from "@app/material/material.module";
import { InfrastructureModule } from "@app/infrastructure/infrastructure.module";
import { PublicRoutingModule } from "./public-routing.module";
import { PublicComponent } from "./public.component";
import { LoginComponent } from "./login/login.component";
import { SharedModule } from "@app/shared/shared.module";


@NgModule({
  declarations: [
    PublicComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    PublicRoutingModule,
    InfrastructureModule,
  ],
})
export class PublicModule { }
