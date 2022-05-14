import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddressAddComponent } from "./add/address-add.component";

import { AddressesComponent } from "./addresses.component";
import { AddressEditComponent } from "./edit/address-edit.component";
import { AddressListComponent } from "./list/address-list.component";

const routes: Routes = [
  {
    path: "",
    component: AddressesComponent,
    children: [
      {
        path: "",
        component: AddressListComponent,
        data: {
          reuse: false,
        },
      },
      {
        path: "add",
        component: AddressAddComponent,
        data: {
          reuse: false,
        },
      },
      {
        path: "edit/:id",
        component: AddressEditComponent,
        data: {
          reuse: false,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddressesRoutingModule { }
