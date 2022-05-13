import { Injectable } from "@angular/core";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

import { environment } from "@env/environment";
import { TOKEN_KEY } from "@app/infrastructure/services/authentication/authentication.service";
import { RouterService } from "@app/infrastructure/services/router/router.service";
import { SnackbarService } from "@app/infrastructure/services/snackbar/snackbar.service";
import { StorageService } from "@app/infrastructure/services/storage/storage.service";

/**
 * Adds a default error handler to all requests.
 */
@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(private storageService: StorageService, private routerService: RouterService, private snackbarService: SnackbarService) {}

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
      this.storageService.remove(TOKEN_KEY);

      if (["JsonWebTokenError", "TokenExpiredError", "AuthorizationRequiredError"].includes(response.error.name)) {
        this.snackbarService.showSnackbarWarning(response.error.message);
      }

      this.routerService.navigateToMain();
    }

    throw response;
  }
}
