import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "@app/material/material.module";
import { SharedModule } from "@app/shared/shared.module";

import { AddressesRoutingModule } from "./addresses-routing.module";
import { AddressesComponent } from "./addresses.component";
import { AddressListComponent } from "./list/address-list.component";
import { AddressAddComponent } from "./add/address-add.component";
import { AddressEditComponent } from "./edit/address-edit.component";

@NgModule({
  declarations: [
    AddressesComponent,
    AddressListComponent,
    AddressAddComponent,
    AddressEditComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AddressesRoutingModule,
    MaterialModule,
    SharedModule,
  ],
})
export class AddressesModule { }
