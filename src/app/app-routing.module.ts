import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthenticationGuard, AuthenticationModes } from "./infrastructure/services/authentication/authentication.guard";
import { DashboardComponent } from "./shared/components/dashboard/dashboard.component";

const routes: Routes = [
  {
    path: "",
    canActivate: [AuthenticationGuard],
    data: {
      authMode: AuthenticationModes.ANY,
      reuse: false,
    },
    component: DashboardComponent,
    children: [
      {
        path: "vendors",
        loadChildren: () => import("./modules/vendors/vendors.module").then(m => m.VendorsModule),
      },
    ],
  },
  {
    path: "auth",
    canActivate: [AuthenticationGuard],
    data: {
      authMode: AuthenticationModes.ANY,
      reuse: false,
    },
    loadChildren: () => import("./modules/auth/auth.module").then(m => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: "enabled", relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
