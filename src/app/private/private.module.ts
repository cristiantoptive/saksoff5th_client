import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MaterialModule } from "@app/material/material.module";
import { PrivateRoutingModule } from "./private-routing.module";
import { PrivateComponent } from "./private.component";
import { SharedModule } from "@app/shared/shared.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { SharedModule as PrivateSharedModule } from "./shared/shared.module";


@NgModule({
  declarations: [
    PrivateComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    PrivateSharedModule,
    PrivateRoutingModule,
    MaterialModule,
  ],
})
export class PrivateModule { }
