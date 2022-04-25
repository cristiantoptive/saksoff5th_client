import { Component, OnInit, OnDestroy } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.scss"],
  host: { class: "full-size" },
})
export class SidenavComponent implements OnInit, OnDestroy {
  public isSidenavOpened = false;
  private routerEventsSub: Subscription;

  constructor(private router: Router) { }

  public ngOnInit(): void {
    this.routerEventsSub = this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(() => {
        this.isSidenavOpened = false;
      });
  }

  public ngOnDestroy(): void {
    this.routerEventsSub.unsubscribe();
  }

  public open(): void {
    this.isSidenavOpened = true;
  }
}
