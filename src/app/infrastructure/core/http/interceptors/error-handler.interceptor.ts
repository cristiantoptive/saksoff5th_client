import { Injectable } from "@angular/core";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { environment } from "@env/environment";
import { AuthenticationService } from "@app/infrastructure/services/authentication/authentication.service";
import { RouterService } from "@app/infrastructure/services/router/router.service";
import { SnackbarService } from "@app/infrastructure/services/snackbar/snackbar.service";

/**
 * Adds a default error handler to all requests.
 */
@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService, private routerService: RouterService, private snackbarService: SnackbarService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(error => this.errorHandler(request, error)));
  }

  // Customize the default error handler here if needed
  private errorHandler(request: HttpRequest<any>, response: HttpEvent<any>): Observable<HttpEvent<any>> {
    if (!environment.production) {
      console.error("Request error", response);
    }

    if (response instanceof HttpErrorResponse && (
      response.error.name === "TokenExpiredError" || response.error.name === "AuthorizationRequiredError" || response.statusText === "Unauthorized"
    )) {
      return this.authService
        .signout()
        .pipe(tap(() => {
          if (["JsonWebTokenError", "TokenExpiredError", "AuthorizationRequiredError"].includes(response.error.name)) {
            this.snackbarService.showSnackbarWarning(response.error.message);
          }

          this.routerService.navigateToPublicSection();
        }));
    }

    throw response;
  }
}
