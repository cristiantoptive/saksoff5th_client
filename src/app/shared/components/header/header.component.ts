import { Component, Output, EventEmitter, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AuthenticationService } from "@app/infrastructure/services/authentication/authentication.service";
import { environment } from "@env/environment";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  @ViewChild("popupRef") popupRef;

  @Output() toggleSidenav = new EventEmitter();

  public version: string;
  public buildNumber: string;

  constructor(
    private authService: AuthenticationService,
    public dialog: MatDialog,
  ) {
    this.version = environment.version;
    this.buildNumber = environment.buildNumber;
  }

  public logout(): void {
    this.authService.signout().subscribe();
  }

  public about(): void {
    this.dialog.open(this.popupRef, {
      width: "100%",
    });
  }
}
