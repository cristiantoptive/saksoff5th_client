import { Component, OnDestroy } from "@angular/core";
import { SubCollector } from "@app/infrastructure/core/helpers/subcollertor";
import { UserViewModel } from "@app/infrastructure/interfaces/users";
import { AuthenticationService } from "@app/infrastructure/services/authentication/authentication.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  host: { class: "full-size" },
})
export class DashboardComponent implements OnDestroy {
  @SubCollector() subscriptions;

  public user: UserViewModel;

  constructor(
    private authService: AuthenticationService,
  ) {
    this.subscriptions = this.authService
      .currentUser()
      .subscribe(user => {
        this.user = user;
      });
  }

  /** note: required by @SubCollector() to work correctly */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnDestroy(): void { }
}
