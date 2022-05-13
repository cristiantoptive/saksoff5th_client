import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AddressViewModel, AddressCommand } from "@app/infrastructure/interfaces/addresses";
import { DeletedViewModel } from "@app/infrastructure/interfaces/shared";

@Injectable({
  providedIn: "root",
})
export class AddressesService {
  constructor(
    private http: HttpClient,
  ) { }

  public all(): Observable<AddressViewModel[]> {
    return this.http.get<AddressViewModel[]>("/addresses");
  }

  public one(id: string): Observable<AddressViewModel> {
    return this.http.get<AddressViewModel>(`/addresses/${id}`);
  }

  public create(command: AddressCommand): Observable<AddressViewModel> {
    return this.http.post<AddressViewModel>("/addresses", command);
  }

  public update(id: string, command: AddressCommand): Observable<AddressViewModel> {
    return this.http.put<AddressViewModel>(`/addresses/${id}`, command);
  }

  public delete(id: string): Observable<DeletedViewModel> {
    return this.http.delete<DeletedViewModel>(`/addresses/${id}`);
  }
}
