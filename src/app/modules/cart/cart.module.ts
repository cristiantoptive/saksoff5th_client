import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "@app/material/material.module";
import { SharedModule } from "@app/shared/shared.module";

import { CartRoutingModule } from "./cart-routing.module";
import { CartComponent } from "./cart.component";
import { MyCartComponent } from "./my-cart/my-cart.component";


@NgModule({
  declarations: [
    CartComponent,
    MyCartComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MaterialModule,
    CartRoutingModule,
  ],
})
export class CartModule { }
