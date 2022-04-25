import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AlertConfig } from "@app/infrastructure/interfaces/alerts";

@Component({
  selector: "app-alert",
  templateUrl: "./alert.component.html",
  styleUrls: ["./alert.component.scss"],
})
export class AlertComponent {
  public get dialogAccent(): string {
    return {
      confirm: "warn",
      info: "primary",
      success: "primary",
      warning: "warn",
      error: "accent",
    }[this.data.type];
  }

  public get dialogIcon(): string {
    return {
      confirm: "help_outline",
      info: "info",
      success: "check_circle",
      warning: "warning",
      error: "report",
    }[this.data.type];
  }

  constructor(
    public dialogRef: MatDialogRef<AlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AlertConfig,
  ) {
    dialogRef.disableClose = !data.allowClose;
  }
}
