import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { SharedModule } from "@app/shared/shared.module";
import { MaterialModule } from "@app/material/material.module";
import { UsersRoutingModule } from "./users-routing.module";
import { UsersComponent } from "./users.component";
import { UserListComponent } from "./list/user-list.component";
import { UserAddComponent } from "./add/user-add.component";
import { UserEditComponent } from "./edit/user-edit.component";

@NgModule({
  declarations: [
    UsersComponent,
    UserListComponent,
    UserAddComponent,
    UserEditComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    MaterialModule,
    SharedModule,
  ],
})
export class UsersModule { }
