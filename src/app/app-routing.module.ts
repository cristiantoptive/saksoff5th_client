import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { Roles } from "@app/infrastructure/interfaces/users";
import { AuthenticationGuard, AuthenticationModes } from "@app/infrastructure/services/authentication/authentication.guard";
import { DashboardComponent } from "@app/shared/components/dashboard/dashboard.component";

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
        canActivate: [AuthenticationGuard],
        data: {
          authMode: AuthenticationModes.LOGGED_IN,
          authRoles: [Roles.Merchandiser],
          reuse: false,
        },
        loadChildren: () => import("./modules/vendors/vendors.module").then(m => m.VendorsModule),
      },
      {
        path: "products",
        canActivate: [AuthenticationGuard],
        data: {
          authMode: AuthenticationModes.LOGGED_IN,
          authRoles: [Roles.Merchandiser],
          reuse: false,
        },
        loadChildren: () => import("./modules/products/products.module").then(m => m.ProductsModule),
      },
      {
        path: "categories",
        canActivate: [AuthenticationGuard],
        data: {
          authMode: AuthenticationModes.LOGGED_IN,
          authRoles: [Roles.Admin],
          reuse: false,
        },
        loadChildren: () => import("./modules/categories/categories.module").then(m => m.CategoriesModule),
      },
      {
        path: "users",
        canActivate: [AuthenticationGuard],
        data: {
          authMode: AuthenticationModes.LOGGED_IN,
          authRoles: [Roles.Admin],
          reuse: false,
        },
        loadChildren: () => import("./modules/users/users.module").then(m => m.UsersModule),
      },
      {
        path: "addresses",
        canActivate: [AuthenticationGuard],
        data: {
          authMode: AuthenticationModes.LOGGED_IN,
          authRoles: [Roles.Admin, Roles.Merchandiser, Roles.Customer],
          reuse: false,
        },
        loadChildren: () => import("./modules/addresses/addresses.module").then(m => m.AddressesModule),
      },
      {
        path: "cards",
        canActivate: [AuthenticationGuard],
        data: {
          authMode: AuthenticationModes.LOGGED_IN,
          authRoles: [Roles.Admin, Roles.Merchandiser, Roles.Customer],
          reuse: false,
        },
        loadChildren: () => import("./modules/cards/cards.module").then(m => m.CardsModule),
      },
      {
        path: "",
        loadChildren: () => import("./modules/catalog/catalog.module").then(m => m.CatalogModule),
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
