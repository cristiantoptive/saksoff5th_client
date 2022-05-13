import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { UserViewModel, UserExcerptViewModel, UserCommand } from "@app/infrastructure/interfaces/users";
import { DeletedViewModel } from "@app/infrastructure/interfaces/shared";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  constructor(
    private http: HttpClient,
  ) { }

  public all(onlyMine?: boolean): Observable<UserExcerptViewModel[]> {
    return this.http.get<UserExcerptViewModel[]>("/users", { params: { onlyMine } });
  }

  public one(id: string): Observable<UserExcerptViewModel> {
    return this.http.get<UserExcerptViewModel>(`/users/${id}`);
  }

  public create(command: UserCommand): Observable<UserViewModel> {
    return this.http.post<UserViewModel>("/users", command);
  }

  public update(id: string, command: UserCommand): Observable<UserViewModel> {
    return this.http.put<UserViewModel>(`/users/${id}`, command);
  }

  public delete(id: string): Observable<DeletedViewModel> {
    return this.http.delete<DeletedViewModel>(`/users/${id}`);
  }
}
