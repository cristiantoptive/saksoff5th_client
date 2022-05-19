import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { TOKEN_KEY } from "@app/infrastructure/services/authentication/authentication.service";
import { StorageService } from "@app/infrastructure/services/storage/storage.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private storageService: StorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from the service.
    const authToken = this.storageService.get(TOKEN_KEY);

    /*
     * Clone the request and replace the original headers with
     * cloned headers, updated with the authorization.
     */
    const authReq = authToken ? req.clone({
      headers: req.headers.set("Authorization", `Bearer ${authToken}`),
    }) : req;

    // send cloned request with header to the next handler.
    return next
      .handle(authReq)
      .pipe(
        tap((res: HttpEvent<any>) => { // watch response for updated auth token
          if (res instanceof HttpResponse) {
            const updatedToken = res.headers.get("Authorization");
            if (updatedToken) {
              this.storageService.set(TOKEN_KEY, updatedToken);
            }
          }
        }),
      );
  }
}
