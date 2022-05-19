import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MaterialModule } from "@app/material/material.module";
import { InfrastructureModule } from "@app/infrastructure/infrastructure.module";
import { SpinnerComponent } from "./components/spinner/spinner.component";
import { AlertComponent } from "./components/alert/alert.component";
import { SidenavComponent } from "./components/sidenav/sidenav.component";
import { HeaderComponent } from "./components/header/header.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { UploadsComponent } from "./components/uploads/uploads.component";

@NgModule({
  declarations: [
    SpinnerComponent,
    AlertComponent,
    SidenavComponent,
    HeaderComponent,
    DashboardComponent,
    UploadsComponent,
  ],
  exports: [
    SpinnerComponent,
    AlertComponent,
    SidenavComponent,
    HeaderComponent,
    DashboardComponent,
    UploadsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule,
    InfrastructureModule,
  ],
})
export class SharedModule { }
