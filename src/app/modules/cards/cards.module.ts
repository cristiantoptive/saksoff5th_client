import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "@app/material/material.module";
import { SharedModule } from "@app/shared/shared.module";

import { CardsRoutingModule } from "./cards-routing.module";
import { CardsComponent } from "./cards.component";
import { CardListComponent } from "./list/cards-list.component";
import { CardAddComponent } from "./add/cards-add.component";
import { CardEditComponent } from "./edit/cards-edit.component";

@NgModule({
  declarations: [
    CardsComponent,
    CardListComponent,
    CardAddComponent,
    CardEditComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardsRoutingModule,
    MaterialModule,
    SharedModule,
  ],
})
export class CardsModule { }
