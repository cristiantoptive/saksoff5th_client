import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OrderAddComponent } from "./add/orders-add.component";
import { OrderListComponent } from "./list/orders-list.component";
import { OrdersComponent } from "./orders.component";

const routes: Routes = [
  {
    path: "",
    component: OrdersComponent,
    children: [
      {
        path: "",
        component: OrderListComponent,
      },
      {
        path: "add",
        component: OrderAddComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule { }
