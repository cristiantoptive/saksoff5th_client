import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";

import { MaterialModule } from "@app/material/material.module";
import { SharedModule as PublicSharedModule } from "@app/shared/shared.module";

import { HeaderComponent } from "./header/header.component";
import { SidenavComponent } from "./sidenav/sidenav.component";

@NgModule({
  declarations: [
    HeaderComponent,
    SidenavComponent,
  ],
  exports: [
    HeaderComponent,
    SidenavComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    PublicSharedModule,
    MatExpansionModule,
    MatDialogModule,
  ],
})
export class SharedModule { }
