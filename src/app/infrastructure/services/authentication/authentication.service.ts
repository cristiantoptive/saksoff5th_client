import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, ReplaySubject, BehaviorSubject, of } from "rxjs";
import { mergeMap, tap } from "rxjs/operators";

import { AuthTokenViewModel, SigninCommand, SignupCommand, ChangePasswordCommand } from "@app/infrastructure/interfaces/authentication";
import { UserViewModel } from "@app/infrastructure/interfaces/users";
import { StorageService } from "../storage/storage.service";

export const TOKEN_KEY = "auth_token";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  // Authentication status
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isLoggedIn());

  // Current Authenticated user
  private currentUserSubject = new ReplaySubject<UserViewModel>(1);
  private currentUserObservable = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) {
    this.isAuthenticated()
      .pipe(mergeMap(status => status ? this.fetchCurrentUser() : this.clearCurrentUser()))
      .subscribe();

    this.storageService.watch(TOKEN_KEY)
      .subscribe(val => {
        if (val.oldValue && !val.newValue) {
          this.isAuthenticatedSubject.next(false);
        }
      });
  }

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

  public currentUser(): Observable<UserViewModel> {
    return this.currentUserObservable;
  }

  public changePassword(password: ChangePasswordCommand): Observable<UserViewModel> {
    return this.http.put<UserViewModel>("/auth/changePassword", password);
  }

  private fetchCurrentUser(): Observable<UserViewModel> {
    return this.http.get<UserViewModel>("/auth/user")
      .pipe(
        tap(res => {
          this.setCurrentUser(res);
        }),
      );
  }

  private clearCurrentUser(): Observable<UserViewModel> {
    return of<UserViewModel>({
      id: undefined,
      email: undefined,
      role: undefined,
      firstName: undefined,
      lastName: undefined,
    }).pipe(
      tap(res => {
        this.setCurrentUser(res);
      }),
    );
  }

  private setCurrentUser(user: UserViewModel) {
    this.currentUserSubject.next(user);
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
