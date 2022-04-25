import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, ReplaySubject, of } from "rxjs";
import { mergeMap, tap } from "rxjs/operators";

import { ChangePasswordCommand, UserViewModel } from "@app/infrastructure/interfaces/users";
import { AuthenticationService } from "../authentication/authentication.service";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  // Current Authenticated user
  private currentUserSubject = new ReplaySubject<UserViewModel>(1);
  private currentUserObservable = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
  ) {
    this.authService
      .isAuthenticated()
      .pipe(mergeMap(status => status ? this.fetchCurrentUser() : this.clearCurrentUser()))
      .subscribe();
  }

  public currentUser(): Observable<UserViewModel> {
    return this.currentUserObservable;
  }

  public changePassword(password: ChangePasswordCommand): Observable<UserViewModel> {
    return this.http.put<UserViewModel>("/users/changePassword", password);
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
}
