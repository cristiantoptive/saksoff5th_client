import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { VendorViewModel, VendorCommand } from "@app/infrastructure/interfaces/vendors";
import { DeletedViewModel } from "@app/infrastructure/interfaces/shared";

@Injectable({
  providedIn: "root",
})
export class VendorsService {
  constructor(
    private http: HttpClient,
  ) { }

  public all(onlyMine: boolean = false): Observable<VendorViewModel[]> {
    return this.http.get<VendorViewModel[]>("/vendors", { params: { onlyMine } });
  }

  public one(id: string): Observable<VendorViewModel> {
    return this.http.get<VendorViewModel>(`/vendors/${id}`);
  }

  public create(command: VendorCommand): Observable<VendorViewModel> {
    return this.http.post<VendorViewModel>("/vendors", command);
  }

  public update(id: string, command: VendorCommand): Observable<VendorViewModel> {
    return this.http.put<VendorViewModel>(`/vendors/${id}`, command);
  }

  public delete(id: string): Observable<DeletedViewModel> {
    return this.http.delete<DeletedViewModel>(`/vendors/${id}`);
  }
}
