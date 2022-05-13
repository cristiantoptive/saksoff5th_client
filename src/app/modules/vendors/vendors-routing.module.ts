import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { VendorListComponent } from "./list/vendor-list.component";
import { VendorsComponent } from "./vendors.component";

const routes: Routes = [
  {
    path: "",
    component: VendorsComponent,
    children: [
      {
        path: "",
        component: VendorListComponent,
      },
      {
        path: "add",
        component: VendorListComponent,
      },
      {
        path: "edit/:id",
        component: VendorListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorsRoutingModule { }
