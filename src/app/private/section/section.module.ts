import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MaterialModule } from "@app/material/material.module";
import { SharedModule } from "@app/shared/shared.module";
import { SharedModule as PrivateSharedModule } from "@app/private/shared/shared.module";

import { SectionRoutingModule } from "./section-routing.module";
import { SectionComponent } from "./section.component";


@NgModule({
  declarations: [
    SectionComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SectionRoutingModule,
    SharedModule,
    PrivateSharedModule,
  ],
})
export class SectionModule { }
