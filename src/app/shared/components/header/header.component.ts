import { Component, Output, EventEmitter, ViewChild, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { UserViewModel } from "@app/infrastructure/interfaces/users";
import { AuthenticationService } from "@app/infrastructure/services/authentication/authentication.service";
import { environment } from "@env/environment";
import { getMenuesForUser } from "@app/infrastructure/config";
import { RouterService } from "@app/infrastructure/services/router/router.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  @ViewChild("popupRef") popupRef;

  @Input() user: UserViewModel;
  @Output() toggleSidenav = new EventEmitter();

  public version: string;
  public buildNumber: string;

  public get menues(): any {
    return getMenuesForUser(this.user);
  }

  constructor(
    private authService: AuthenticationService,
    private routerService: RouterService,
    public dialog: MatDialog,
  ) {
    this.version = environment.version;
    this.buildNumber = environment.buildNumber;
  }

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
