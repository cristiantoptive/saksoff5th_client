import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { getMenuesForUser } from "@app/infrastructure/config";
import { SubCollector } from "@app/infrastructure/core/helpers/subcollertor";
import { UserViewModel } from "@app/infrastructure/interfaces/users";

@Component({
  selector: "app-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.scss"],
  host: { class: "full-size" },
})
export class SidenavComponent implements OnInit, OnDestroy {
  public isSidenavOpened = false;

  @Input() user: UserViewModel;
  @SubCollector() subscriptions;

  public get menues(): any {
    return getMenuesForUser(this.user);
  }

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.subscriptions = this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(() => {
        this.isSidenavOpened = false;
      });
  }

  /** note: required by @SubCollector() to work correctly */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnDestroy(): void { }

  open(): void {
    this.isSidenavOpened = true;
  }
}
