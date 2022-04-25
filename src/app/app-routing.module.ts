import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthenticationGuard, AuthenticationModes } from "./infrastructure/services/authentication/authentication.guard";

const routes: Routes = [
  {
    path: "",
    canActivate: [AuthenticationGuard],
    data: {
      authMode: AuthenticationModes.NOT_LOGGED_IN,
      reuse: false,
    },
    loadChildren: () => import("./public/public.module").then(m => m.PublicModule),
  },
  {
    path: "dashboard",
    canActivate: [AuthenticationGuard],
    data: {
      authMode: AuthenticationModes.LOGGED_IN,
      reuse: false,
    },
    loadChildren: () => import("./private/private.module").then(m => m.PrivateModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: "enabled", relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
