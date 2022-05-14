import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { SharedModule } from "@app/shared/shared.module";
import { MaterialModule } from "@app/material/material.module";
import { CategoriesRoutingModule } from "./categories-routing.module";
import { CategoriesComponent } from "./categories.component";
import { CategoryListComponent } from "./list/category-list.component";
import { CategoryAddComponent } from "./add/category-add.component";
import { CategoryEditComponent } from "./edit/category-edit.component";

@NgModule({
  declarations: [
    CategoriesComponent,
    CategoryListComponent,
    CategoryAddComponent,
    CategoryEditComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CategoriesRoutingModule,
    MaterialModule,
    SharedModule,
  ],
})
export class CategoriesModule { }
