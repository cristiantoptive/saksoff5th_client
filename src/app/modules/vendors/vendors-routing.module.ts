import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthenticationGuard, AuthenticationModes } from "@app/infrastructure/services/authentication/authentication.guard";
import { VendorsComponent } from "./vendors.component";
import { VendorListComponent } from "./list/vendor-list.component";
import { VendorAddComponent } from "./add/vendor-add.component";
import { VendorEditComponent } from "./edit/vendor-edit.component";

const routes: Routes = [
  {
    path: "",
    component: VendorsComponent,
    data: {
      authMode: AuthenticationModes.LOGGED_IN,
      reuse: false,
    },
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: "",
        component: VendorListComponent,
        data: {
          reuse: false,
        },
      },
      {
        path: "add",
        component: VendorAddComponent,
        data: {
          reuse: false,
        },
      },
      {
        path: "edit/:id",
        component: VendorEditComponent,
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
export class VendorsRoutingModule { }
