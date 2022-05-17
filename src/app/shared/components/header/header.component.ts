import { Component, Output, EventEmitter, ViewChild, Input, OnInit, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { UserViewModel } from "@app/infrastructure/interfaces/users";
import { AuthenticationService } from "@app/infrastructure/services/authentication/authentication.service";
import { environment } from "@env/environment";
import { getMenuesForUser } from "@app/infrastructure/config";
import { RouterService } from "@app/infrastructure/services/router/router.service";
import { CartService } from "@app/infrastructure/services/cart/cart.service";
import { SubCollector } from "@app/infrastructure/core/helpers/subcollertor";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild("popupRef") popupRef;

  @Input() user: UserViewModel;
  @Output() toggleSidenav = new EventEmitter();

  public version: string;
  public buildNumber: string;
  public cartItemsCount: number;

  public get menues(): any {
    return getMenuesForUser(this.user);
  }

  @SubCollector()
  public subscriptions;

  constructor(
    private authService: AuthenticationService,
    private cartService: CartService,
    private routerService: RouterService,
    public dialog: MatDialog,
  ) {
    this.version = environment.version;
    this.buildNumber = environment.buildNumber;
  }

  ngOnInit(): void {
    this.subscriptions = this.cartService
      .currentCart()
      .subscribe(items => {
        this.cartItemsCount = items.length;
      });
  }

  /** note: required by @SubCollector() to work correctly */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnDestroy(): void { }

  public logout(): void {
    this.authService.signout().subscribe();
  }

  public login(): void {
    this.routerService.navigateToSignin();
  }

  public about(): void {
    this.dialog.open(this.popupRef, {
      width: "100%",
    });
  }
}
