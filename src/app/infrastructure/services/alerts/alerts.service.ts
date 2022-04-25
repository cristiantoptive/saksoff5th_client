import { Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AlertConfig, AlertType } from "@app/infrastructure/interfaces/alerts";
import { AlertComponent } from "@app/shared/components/alert/alert.component";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AlertsService {
  constructor(private dialog: MatDialog) {}

  closeAll(): void {
    this.dialog.closeAll();
  }

  showAlert(config: AlertConfig): Observable<any> {
    const dialogRef: MatDialogRef<AlertComponent> = this.dialog.open(AlertComponent, {
      width: "350px",
      data: {
        showIcon: true,
        ...config,
      },
    });

    return dialogRef
      .afterClosed()
      .pipe(map(res => res || false));
  }

  showConfirm(config: AlertConfig): Observable<any> {
    return this.showAlert({
      ...config,
      type: AlertType.confirm,
    });
  }

  // blue alert
  showInfoAlert(config: AlertConfig): Observable<any> {
    return this.showAlert({
      ...config,
      type: AlertType.info,
    });
  }

  // green alert
  showSuccessAlert(config: AlertConfig): Observable<any> {
    return this.showAlert({
      ...config,
      type: AlertType.success,
    });
  }

  // yellow alert
  showWarningAlert(config: AlertConfig): Observable<any> {
    return this.showAlert({
      ...config,
      type: AlertType.warning,
    });
  }

  // red alert
  showErrorAlert(config: AlertConfig): Observable<any> {
    return this.showAlert({
      ...config,
      type: AlertType.error,
    });
  }
}
