import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProductsComponent } from "./products.component";
import { ProductListComponent } from "./list/product-list.component";
import { ProductAddComponent } from "./add/product-add.component";
import { ProductEditComponent } from "./edit/product-edit.component";

const routes: Routes = [
  {
    path: "",
    component: ProductsComponent,
    children: [
      {
        path: "",
        component: ProductListComponent,
        data: {
          reuse: false,
        },
      },
      {
        path: "add",
        component: ProductAddComponent,
        data: {
          reuse: false,
        },
      },
      {
        path: "edit/:id",
        component: ProductEditComponent,
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
export class ProductsRoutingModule { }
