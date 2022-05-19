import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCarouselModule } from "@ngbmodule/material-carousel";

import { CatalogRoutingModule } from "./catalog-routing.module";
import { CatalogComponent } from "./catalog.component";
import { CatalogListComponent } from "./list/catalog-list.component";
import { MaterialModule } from "@app/material/material.module";
import { SharedModule } from "@app/shared/shared.module";


@NgModule({
  declarations: [
    CatalogComponent,
    CatalogListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CatalogRoutingModule,
    MaterialModule,
    SharedModule,
    MatCarouselModule.forRoot(),
  ],
})
export class CatalogModule { }
