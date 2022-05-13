import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ProductViewModel, ProductCommand } from "@app/infrastructure/interfaces/products";
import { DeletedViewModel } from "@app/infrastructure/interfaces/shared";

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  constructor(
    private http: HttpClient,
  ) { }

  public all(onlyMine?: boolean): Observable<ProductViewModel[]> {
    return this.http.get<ProductViewModel[]>("/products", { params: { onlyMine } });
  }

  public one(id: string): Observable<ProductViewModel> {
    return this.http.get<ProductViewModel>(`/products/${id}`);
  }

  public create(command: ProductCommand): Observable<ProductViewModel> {
    return this.http.post<ProductViewModel>("/products", command);
  }

  public update(id: string, command: ProductCommand): Observable<ProductViewModel> {
    return this.http.put<ProductViewModel>(`/products/${id}`, command);
  }

  public delete(id: string): Observable<DeletedViewModel> {
    return this.http.delete<DeletedViewModel>(`/products/${id}`);
  }
}
