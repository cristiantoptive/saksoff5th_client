import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject, of } from "rxjs";
import { tap } from "rxjs/operators";

import { AuthTokenViewModel, SigninCommand, SignupCommand } from "@app/infrastructure/interfaces/authentication";
import { StorageService } from "../storage/storage.service";

const TOKEN_KEY = "auth_token";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  // Authentication status
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) { }

  public isAuthenticated(): Observable<any> {
    return this.isAuthenticatedSubject.asObservable();
  }

  public signin(command: SigninCommand): Observable<AuthTokenViewModel> {
    return this.http.post<AuthTokenViewModel>("/auth/signin", command)
      .pipe(
        tap(res => {
          this.setAuthorizationToken(res.token);
          this.isAuthenticatedSubject.next(this.isLoggedIn());
        }),
      );
  }

  public signup(command: SignupCommand): Observable<AuthTokenViewModel> {
    return this.http.post<AuthTokenViewModel>("/auth/signup", command)
      .pipe(
        tap(res => {
          this.setAuthorizationToken(res.token);
          this.isAuthenticatedSubject.next(this.isLoggedIn());
        }),
      );
  }

  public signout(): Observable<undefined> {
    return of(null)
      .pipe(
        tap(() => {
          this.clearAuthorizationToken();
          this.isAuthenticatedSubject.next(this.isLoggedIn());
        }),
      );
  }

  public isLoggedIn(): boolean {
    return !!this.getAuthorizationToken();
  }

  public getAuthorizationToken(): string {
    return this.storageService.get(TOKEN_KEY);
  }

  public setAuthorizationToken(token: string): void {
    this.storageService.set(TOKEN_KEY, token);
  }

  private clearAuthorizationToken(): void {
    this.storageService.remove(TOKEN_KEY);
  }
}
