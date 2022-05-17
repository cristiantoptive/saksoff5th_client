import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CartComponent } from "./cart.component";
import { MyCartComponent } from "./my-cart/my-cart.component";

const routes: Routes = [
  {
    path: "",
    component: CartComponent,
    children: [
      {
        path: "",
        component: MyCartComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartRoutingModule { }
