import { Injectable, OnDestroy } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";

import { RouterService } from "../router/router.service";
import { AuthenticationService } from "./authentication.service";

// eslint-disable-next-line no-shadow
export enum AuthenticationModes {
  NOT_LOGGED_IN = 1,
  LOGGED_IN = 2,
  ANY = 3,
}

@Injectable({
  providedIn: "root",
})
export class AuthenticationGuard implements CanActivate, OnDestroy {
  private subscription: Subscription;
  private urlOnAuthenticated: string;

  constructor(private router: Router, private authService: AuthenticationService, private routerService: RouterService) {}

  canActivate(snapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const authMode = snapshot.data.authMode || AuthenticationModes.ANY;

    // When any kind of authentication is allowed
    if (authMode === AuthenticationModes.ANY) {
      return true;
    }

    // Watch authenticated status
    this.subscription = this.authService.isAuthenticated()
      .pipe(debounceTime(350)) // Wait for events propagation
      .subscribe(authenticated => {
        switch (authMode) {
        case AuthenticationModes.LOGGED_IN:
          if (!authenticated) {
            this.urlOnAuthenticated = state.url;
            this.routerService.navigateToSignin();
          }

          break;
        case AuthenticationModes.NOT_LOGGED_IN:
          if (authenticated) {
            if (this.urlOnAuthenticated) {
              this.router.navigateByUrl(this.urlOnAuthenticated);
              this.urlOnAuthenticated = null;
            } else {
              this.routerService.navigateToMain();
            }
          }

          break;
        default: break;
        }
      });

    return (
      (authMode === AuthenticationModes.LOGGED_IN && this.authService.isLoggedIn()) ||
      (authMode === AuthenticationModes.NOT_LOGGED_IN && !this.authService.isLoggedIn())
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
