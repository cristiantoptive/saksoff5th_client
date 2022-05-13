import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "@app/shared/shared.module";
import { VendorsRoutingModule } from "./vendors-routing.module";
import { VendorsComponent } from "./vendors.component";
import { VendorListComponent } from "./list/vendor-list.component";
import { MaterialModule } from "@app/material/material.module";


@NgModule({
  declarations: [
    VendorsComponent,
    VendorListComponent,
  ],
  imports: [
    CommonModule,
    VendorsRoutingModule,
    MaterialModule,
    SharedModule,
  ],
})
export class VendorsModule { }
