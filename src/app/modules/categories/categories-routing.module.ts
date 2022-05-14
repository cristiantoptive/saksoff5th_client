import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CategoriesComponent } from "./categories.component";
import { CategoryListComponent } from "./list/category-list.component";
import { CategoryAddComponent } from "./add/category-add.component";
import { CategoryEditComponent } from "./edit/category-edit.component";

const routes: Routes = [
  {
    path: "",
    component: CategoriesComponent,
    children: [
      {
        path: "",
        component: CategoryListComponent,
        data: {
          reuse: false,
        },
      },
      {
        path: "add",
        component: CategoryAddComponent,
        data: {
          reuse: false,
        },
      },
      {
        path: "edit/:id",
        component: CategoryEditComponent,
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
export class CategoriesRoutingModule { }
