import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { SharedModule } from "@app/shared/shared.module";
import { MaterialModule } from "@app/material/material.module";
import { ProductsRoutingModule } from "./products-routing.module";
import { ProductsComponent } from "./products.component";
import { ProductListComponent } from "./list/product-list.component";
import { ProductAddComponent } from "./add/product-add.component";
import { ProductEditComponent } from "./edit/product-edit.component";

@NgModule({
  declarations: [
    ProductsComponent,
    ProductListComponent,
    ProductAddComponent,
    ProductEditComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductsRoutingModule,
    MaterialModule,
    SharedModule,
  ],
})
export class ProductsModule { }
