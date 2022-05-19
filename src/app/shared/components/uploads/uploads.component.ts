import { HttpEventType, HttpResponse } from "@angular/common/http";
import { Component, ElementRef, Input, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Observable, of, Subscription, zip } from "rxjs";
import { catchError, filter, finalize, map, mergeMap, takeUntil, tap } from "rxjs/operators";
import { saveAs } from "file-saver";
import * as numeral from "numeral";

import { UploadViewModel } from "@app/infrastructure/interfaces/uploads";
import { AlertsService } from "@app/infrastructure/services/alerts/alerts.service";
import { SnackbarService } from "@app/infrastructure/services/snackbar/snackbar.service";
import { UploadsService } from "@app/infrastructure/services/uploads/uploads.service";

const MAXIMUM_FILE_SIZE_IN_BYTES = 10 * 1000 * 1000;
const ACCEPTED_FILE_TYPES = [
  {
    mime: "image/png",
    ext: ".png",
  }, {
    mime: "image/jpeg",
    ext: ".jpeg",
  }, {
    mime: "image/jpeg",
    ext: ".jpg",
  }, {
    mime: "image/gif",
    ext: ".gif",
  },
];

interface UploadModel {
  id?: string;
  file?: File;
  name: string;
  type: string;
  size: number;
  description: string;
  busy?: boolean;
  progress?: number;
  completed?: boolean;
  success?: boolean;
  error?: boolean;
}

@Component({
  selector: "app-uploads",
  templateUrl: "./uploads.component.html",
  styleUrls: ["./uploads.component.scss"],
  host: { class: "d-block" },
})
export class UploadsComponent {
  @ViewChild("fileSelector") fileSelector: ElementRef;
  @ViewChild("downloadDialogTemplate") downloadDialog: TemplateRef<any>;

  @Input() entity: string;
  @Input() entityId: string;
  @Input() title = "Uploads";
  @Input() viewOnly = false;
  @Input() uploads: UploadModel[]|UploadViewModel[] = [];

  public accept = ACCEPTED_FILE_TYPES.map(type => type.mime).join(",");

  public busy = false;

  public downloadProgress: number;

  public downloadFileName: string;

  public downloadFileSize: string;

  private fetchSubscription: Subscription;

  private downloadDialogRef: MatDialogRef<any>;

  constructor(
    private uploadsService: UploadsService,
    private alertsService: AlertsService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
  ) { }

  public onFileSelected($event: Event): void {
    const { files } = $event.target as HTMLInputElement;

    Array.from(files)
      .forEach(file => {
        if (file.size > MAXIMUM_FILE_SIZE_IN_BYTES) {
          this.snackbarService.showSnackbarWarning(`Targe file ${file.name} size is over the limit of ${MAXIMUM_FILE_SIZE_IN_BYTES / 1000 / 1000}MB.`, "Accept");
        } else if (!ACCEPTED_FILE_TYPES.find(type => type.mime === file.type.toLowerCase())) {
          this.snackbarService.showSnackbarWarning(`Target file ${file.name} not allowed`, "Accept");
        } else if (file.name && file.name.length > 255) {
          this.snackbarService.showSnackbarWarning(`File name ${file.name} is over the allowed limit of 255 characters.`, "Accept");
        } else {
          this.uploads.push({
            id: null,
            file,
            name: file.name,
            type: file.type,
            size: file.size,
            description: "",
          });
        }
      });

    // reset file input
    this.fileSelector.nativeElement.type = "text";
    this.fileSelector.nativeElement.value = "";
    this.fileSelector.nativeElement.type = "file";
  }

  public onAddDocument(): void {
    this.fileSelector.nativeElement.click();
  }

  public onDownloadDocument(document: UploadViewModel): void {
    this.downloadProgress = 0;
    this.downloadFileName = null;
    this.downloadFileSize = null;

    this.downloadDialogRef = this.dialog.open(this.downloadDialog, {
      width: "500px",
      maxWidth: "500px",
      restoreFocus: false,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: "position-relative",
      autoFocus: false,
    });

    this.downloadDialogRef
      .afterOpened()
      .pipe(
        mergeMap(() => this.uploadsService.download(document.id)),
        tap(event => {
          if (event.type === HttpEventType.DownloadProgress) {
            this.downloadProgress = Math.round((event.loaded * 100) / event.total);
          }

          if (event.type === HttpEventType.ResponseHeader) {
            this.downloadFileSize = numeral(event.headers.get("content-length")).format("0.0 b");
            const disposition = event.headers.get("content-disposition") || "";
            if (disposition && disposition.indexOf("attachment") !== -1) {
              const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
              const matches = filenameRegex.exec(disposition);
              if (matches !== null && matches[1]) {
                this.downloadFileName = matches[1].replace(/['"]/g, "");
              }
            }
          }
        }),
        takeUntil(this.downloadDialogRef.afterClosed()),
      )
      .subscribe(event => {
        if (event.type === HttpEventType.Response) {
          saveAs(event.body, this.downloadFileName);
          this.downloadDialogRef.close();
        }
      }, () => {
        this.downloadDialogRef.close();
        this.snackbarService.showSnackbarFailure("Can't download target file.");
      });
  }

  public onRemoveDocument(document: UploadModel): void {
    if (!document.id || document.file) {
      this.uploads = (this.uploads as any[]).filter(d => d !== document);
    } else {
      if (this.busy) {
        return;
      }

      if (this.fetchSubscription) {
        this.fetchSubscription.unsubscribe();
      }

      this.fetchSubscription = this.alertsService
        .showConfirm({
          title: "Delete upload",
          content: "Delete upload and target file",
          accept: "Delete",
          cancel: "Cancel",
        })
        .pipe(
          filter(confirm => confirm),
          tap(() => {
            this.busy = true;
            this.uploads = (this.uploads as any[]).filter(d => d.id !== document.id);
          }),
          mergeMap(() => this.uploadsService.delete(document.id)),
        )
        .subscribe(() => {
          this.busy = false;
          this.snackbarService.showSnackbarSuccess("Upload has been deleted");
        }, () => {
          this.busy = false;
          this.snackbarService.showSnackbarFailure("Can't delete target upload");
        });
    }
  }

  public processDocuments(source?: string, sourceId?: string): Observable<any> {
    const updateObs = (this.uploads as UploadViewModel[])
      .filter(document => document.id)
      .map(document =>
        this.uploadsService
          .update(document.id, { description: document.description })
          .pipe(catchError(() => of(null))),
      );

    const uploadsObs = (this.uploads as UploadModel[]).filter(document => document.file).map(document => {
      document.busy = true;
      document.progress = 0;

      return this.uploadsService
        .upload({
          source,
          sourceId,
          file: document.file,
          name: document.name,
          type: document.type,
          size: document.size,
          description: document.description,
        })
        .pipe(
          tap(event => {
            if (event.type === HttpEventType.UploadProgress) {
              document.progress = Math.round((event.loaded * 100) / event.total);
            }

            if (event.type === HttpEventType.Response) {
              document.success = true;
              document.file = null;
              Object.assign(document, event.body);
            }
          }),
          filter(event => event.type === HttpEventType.Response),
          map((event: HttpResponse<any>) => event.body),
          catchError(() => {
            document.error = true;
            return of(null);
          }),
          finalize(() => {
            document.completed = true;
            document.busy = false;
          }),
        );
    });

    return zip(...uploadsObs, ...updateObs, of(null));
  }
}

