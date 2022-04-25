import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SpinnerComponent } from "./components/spinner/spinner.component";
import { AlertComponent } from "./components/alert/alert.component";
import { MaterialModule } from "@app/material/material.module";

@NgModule({
  declarations: [
    SpinnerComponent,
    AlertComponent,
  ],
  exports: [
    SpinnerComponent,
    AlertComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
})
export class SharedModule { }
