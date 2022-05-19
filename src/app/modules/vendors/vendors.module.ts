import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { SharedModule } from "@app/shared/shared.module";
import { MaterialModule } from "@app/material/material.module";
import { VendorsRoutingModule } from "./vendors-routing.module";
import { VendorsComponent } from "./vendors.component";
import { VendorListComponent } from "./list/vendor-list.component";
import { VendorAddComponent } from "./add/vendor-add.component";
import { VendorEditComponent } from "./edit/vendor-edit.component";

@NgModule({
  declarations: [
    VendorsComponent,
    VendorListComponent,
    VendorAddComponent,
    VendorEditComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VendorsRoutingModule,
    MaterialModule,
    SharedModule,
  ],
})
export class VendorsModule { }
