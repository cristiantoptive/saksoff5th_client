import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ProductCategoryViewModel, ProductCategoryCommand } from "@app/infrastructure/interfaces/categories";
import { DeletedViewModel } from "@app/infrastructure/interfaces/shared";

@Injectable({
  providedIn: "root",
})
export class ProductCategoryService {
  constructor(
    private http: HttpClient,
  ) { }

  public all(): Observable<ProductCategoryViewModel[]> {
    return this.http.get<ProductCategoryViewModel[]>("/categories");
  }

  public one(id: string): Observable<ProductCategoryViewModel> {
    return this.http.get<ProductCategoryViewModel>(`/categories/${id}`);
  }

  public create(command: ProductCategoryCommand): Observable<ProductCategoryViewModel> {
    return this.http.post<ProductCategoryViewModel>("/categories", command);
  }

  public update(id: string, command: ProductCategoryCommand): Observable<ProductCategoryViewModel> {
    return this.http.put<ProductCategoryViewModel>(`/categories/${id}`, command);
  }

  public delete(id: string): Observable<DeletedViewModel> {
    return this.http.delete<DeletedViewModel>(`/categories/${id}`);
  }
}
