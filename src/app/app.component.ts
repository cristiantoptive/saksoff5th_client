import { Component } from "@angular/core";
import { ResolveEnd, ResolveStart, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from "@angular/router";
import { SwUpdate } from "@angular/service-worker";
import { delay, filter } from "rxjs/operators";
import { Subscription } from "rxjs";

import { UsersService } from "@app/infrastructure/services/users/users.service";
import { AlertsService } from "@app/infrastructure/services/alerts/alerts.service";
import { AuthenticationService } from "@app/infrastructure/services/authentication/authentication.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  public busy = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private swUpdate: SwUpdate,
    private usersService: UsersService,
    private alertsService: AlertsService,
    private authenticationService: AuthenticationService,

  ) {
    this.subscriptions[0] = this.router.events.subscribe(event => {
      if (event instanceof ResolveStart || event instanceof RouteConfigLoadStart) {
        this.busy = true;
      } else if (event instanceof ResolveEnd || event instanceof RouteConfigLoadEnd) {
        this.busy = false;
      }
    });

    this.subscriptions[1] = this.authenticationService
      .isAuthenticated()
      .subscribe(authenticated => authenticated ? this.whenAuthenticated() : this.whenDeauthenticated());

    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        this.alertsService
          .showConfirm({
            title: "Actualización",
            content: "Nueva versión disponible. La página será recargada durante la actualización.",
            accept: "Actualizar",
            cancel: "Ahora no",
          })
          .subscribe(res => {
            if (!res) {
              return;
            }

            this.busy = true;
            this.swUpdate
              .activateUpdate()
              .then(() => {
                window.location.reload();
              })
              .catch(() => {
                this.busy = false;
                this.alertsService.showErrorAlert({
                  title: "Error",
                  content: "No se pudo actualizar la aplicación, por favor recargar la ventana manualmente.",
                  accept: "Continuar",
                });
              });
          });
      });
    }
  }

  private whenAuthenticated(): void {
    this.busy = true;

    if (this.subscriptions[2]) {
      this.subscriptions[2].unsubscribe();
    }

    this.subscriptions[2] = this.usersService
      .currentUser()
      .pipe(
        filter(user => !!user.id),
        delay(350),
      )
      .subscribe(() => {
        this.busy = false;
      });
  }

  private whenDeauthenticated(): void {
    this.busy = false;

    if (this.subscriptions[2]) {
      this.subscriptions[2].unsubscribe();
    }
  }
}
