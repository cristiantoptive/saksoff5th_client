import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CardViewModel, CardCommand } from "@app/infrastructure/interfaces/cards";
import { DeletedViewModel } from "@app/infrastructure/interfaces/shared";

@Injectable({
  providedIn: "root",
})
export class CardsService {
  constructor(
    private http: HttpClient,
  ) { }

  public all(): Observable<CardViewModel[]> {
    return this.http.get<CardViewModel[]>("/cards");
  }

  public one(id: string): Observable<CardViewModel> {
    return this.http.get<CardViewModel>(`/cards/${id}`);
  }

  public create(command: CardCommand): Observable<CardViewModel> {
    return this.http.post<CardViewModel>("/cards", command);
  }

  public update(id: string, command: CardCommand): Observable<CardViewModel> {
    return this.http.put<CardViewModel>(`/cards/${id}`, command);
  }

  public delete(id: string): Observable<DeletedViewModel> {
    return this.http.delete<DeletedViewModel>(`/cards/${id}`);
  }
}
