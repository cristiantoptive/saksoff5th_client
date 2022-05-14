import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UsersComponent } from "./users.component";
import { UserListComponent } from "./list/user-list.component";
import { UserAddComponent } from "./add/user-add.component";
import { UserEditComponent } from "./edit/user-edit.component";

const routes: Routes = [
  {
    path: "",
    component: UsersComponent,
    children: [
      {
        path: "",
        component: UserListComponent,
        data: {
          reuse: false,
        },
      },
      {
        path: "add",
        component: UserAddComponent,
        data: {
          reuse: false,
        },
      },
      {
        path: "edit/:id",
        component: UserEditComponent,
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
export class UsersRoutingModule { }
