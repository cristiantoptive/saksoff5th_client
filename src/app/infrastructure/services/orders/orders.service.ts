import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { OrderViewModel, OrderCommand } from "@app/infrastructure/interfaces/orders";
import { DeletedViewModel } from "@app/infrastructure/interfaces/shared";

@Injectable({
  providedIn: "root",
})
export class OrdersService {
  constructor(
    private http: HttpClient,
  ) { }

  public all(): Observable<OrderViewModel[]> {
    return this.http.get<OrderViewModel[]>("/orders");
  }

  public one(id: string): Observable<OrderViewModel> {
    return this.http.get<OrderViewModel>(`/orders/${id}`);
  }

  public create(command: OrderCommand): Observable<OrderViewModel> {
    return this.http.post<OrderViewModel>("/orders", command);
  }

  public update(id: string, command: OrderCommand): Observable<OrderViewModel> {
    return this.http.put<OrderViewModel>(`/orders/${id}`, command);
  }

  public delete(id: string): Observable<DeletedViewModel> {
    return this.http.delete<DeletedViewModel>(`/orders/${id}`);
  }
}
