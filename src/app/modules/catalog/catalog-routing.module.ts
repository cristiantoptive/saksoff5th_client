import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CatalogComponent } from "./catalog.component";
import { CatalogListComponent } from "./list/catalog-list.component";

const routes: Routes = [
  {
    path: "",
    component: CatalogComponent,
    children: [
      {
        path: "",
        component: CatalogListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogRoutingModule { }
