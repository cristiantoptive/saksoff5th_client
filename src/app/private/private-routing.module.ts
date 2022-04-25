import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";

import { PrivateComponent } from "./private.component";

const routes: Routes = [{
  path: "",
  component: PrivateComponent,
  children: [
    {
      path: "",
      component: DashboardComponent,
    },
    {
      path: "section",
      loadChildren: () => import("./section/section.module").then(m => m.SectionModule),
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateRoutingModule { }
