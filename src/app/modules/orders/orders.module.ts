import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "@app/material/material.module";
import { SharedModule } from "@app/shared/shared.module";

import { OrdersRoutingModule } from "./orders-routing.module";
import { OrdersComponent } from "./orders.component";
import { OrderAddComponent } from "./add/orders-add.component";
import { OrderListComponent } from "./list/orders-list.component";

@NgModule({
  declarations: [
    OrdersComponent,
    OrderAddComponent,
    OrderListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MaterialModule,
    OrdersRoutingModule,
  ],
})
export class OrdersModule { }
