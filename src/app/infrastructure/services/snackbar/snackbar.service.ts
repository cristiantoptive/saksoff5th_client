import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class SnackbarService {
  constructor(
    private snackBar: MatSnackBar,
  ) { }

  public showSnackbarSuccess(message: string, action?: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action || "", {
      duration: action ? undefined : 3000,
      panelClass: ["bg-success", "text-white"],
    });
  }

  public showSnackbarFailure(message: string | any, action?: string): MatSnackBarRef<SimpleSnackBar> {
    if (message?.error?.name === "ValidationError") {
      const parsedErrors = Object.keys(message.error.errors)
        .reduce((accum, key) => {
          return [
            ...accum,
            `${Object.values(message.error.errors[key]).join(". ")}.`,
          ];
        }, [])
        .join("\r\n");

      return this.snackBar.open(parsedErrors, "", {
        duration: action ? undefined : 5000,
        panelClass: ["bg-warning", "text-white"],
      });
    }

    return this.snackBar.open(typeof message === "string" ? message : (message?.error?.message || message), action || "", {
      duration: action ? undefined : 3000,
      panelClass: ["bg-danger"],
    });
  }

  public showSnackbarWarning(message: string, action?: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action || "", {
      duration: action ? undefined : 3000,
      panelClass: ["bg-warning", "text-white"],
    });
  }

  public showSnackbarDefault(message: string, action?: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action || "", {
      duration: action ? undefined : 3000,
    });
  }
}
