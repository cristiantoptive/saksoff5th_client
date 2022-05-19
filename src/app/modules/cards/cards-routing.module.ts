import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CardsComponent } from "./cards.component";
import { CardEditComponent } from "./edit/cards-edit.component";
import { CardListComponent } from "./list/cards-list.component";
import { CardAddComponent } from "./add/cards-add.component";

const routes: Routes = [
  {
    path: "",
    component: CardsComponent,
    children: [
      {
        path: "",
        component: CardListComponent,
        data: {
          reuse: false,
        },
      },
      {
        path: "add",
        component: CardAddComponent,
        data: {
          reuse: false,
        },
      },
      {
        path: "edit/:id",
        component: CardEditComponent,
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
export class CardsRoutingModule { }
