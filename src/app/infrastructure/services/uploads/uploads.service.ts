import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UploadCommand, UploadUpdateCommand, UploadViewModel } from "@app/infrastructure/interfaces/uploads";

@Injectable({
  providedIn: "root",
})
export class UploadsService {
  constructor(private http: HttpClient) { }

  public upload(document: UploadCommand): Observable<any> {
    const formData = new FormData();
    Object.keys(document).forEach(valueKey => {
      formData.append(`${valueKey}`, document[valueKey]);
    });

    return this.http.post<any>("/upload", formData, { reportProgress: true, observe: "events" });
  }

  public delete(id: string): Observable<any> {
    return this.http.delete<any>(`/upload/${id}`);
  }

  public update(id: string, document: UploadUpdateCommand): Observable<UploadViewModel> {
    return this.http.put<any>(`/upload/${id}`, document);
  }

  public download(id: string): Observable<any> {
    return this.http.get<any>(`/upload/${id}`, { responseType: "blob" as "json", reportProgress: true, observe: "events" });
  }
}
