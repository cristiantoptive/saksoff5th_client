import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MAT_DATE_FORMATS } from "@angular/material/core";
import { MatDatepicker } from "@angular/material/datepicker";
import * as moment from "moment";
import { tap, mergeMap } from "rxjs/operators";
import { SubCollector } from "@app/infrastructure/core/helpers/subcollertor";
import { CardViewModel } from "@app/infrastructure/interfaces/cards";
import { CardsService } from "@app/infrastructure/services/cards/cards.service";
import { RouterService } from "@app/infrastructure/services/router/router.service";
import { SnackbarService } from "@app/infrastructure/services/snackbar/snackbar.service";

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: "MM/YYYY",
  },
  display: {
    dateInput: "MM/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};

@Component({
  templateUrl: "./cards-edit.component.html",
  styleUrls: ["./cards-edit.component.scss"],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_FORMATS,
    },
  ],
})
export class CardEditComponent implements OnInit, OnDestroy {
  @ViewChild("cardFormRef") cardFormRef: ElementRef;

  public cardForm: FormGroup;
  public isBusy = false;

  @SubCollector()
  public subscriptions;

  private card: CardViewModel;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private routerService: RouterService,
    private snackbarService: SnackbarService,
    private cardsService: CardsService,
  ) {
    this.cardForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.maxLength(255)]],
      number: ["", [Validators.required, Validators.maxLength(19)]],
      expiresOn: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.subscriptions = this.route.params
      .pipe(
        tap(() => (this.isBusy = true)),
        mergeMap(params => this.cardsService.one(params.id)),
      )
      .subscribe(res => {
        this.card = res;
        this.cardForm.setValue({
          name: res.name,
          number: "",
          expiresOn: moment(res.expiresOn),
        });
        this.isBusy = false;
      }, err => {
        this.isBusy = false;
        this.snackbarService.showSnackbarFailure(err);
      });
  }

  /** note: required by @SubCollector() to work correctly */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnDestroy(): void { }

  doSave(): void {
    if (this.isBusy) {
      return;
    }

    this.cardForm.markAllAsTouched();
    if (this.cardForm.invalid || this.cardForm.pending) {
      this.focusFirstInvalidInput();
      return;
    }

    this.isBusy = true;

    this.cardsService.update(this.card.id, {
      ...this.cardForm.value,
      expiresOn: this.cardForm.value.expiresOn.toDate().toISOString(),
    })
      .subscribe(() => {
        this.isBusy = false;
        this.routerService.navigateToCards();
        this.snackbarService.showSnackbarSuccess("Card updated");
      }, err => {
        this.isBusy = false;
        this.snackbarService.showSnackbarFailure(err);
      });
  }

  doCancel(): void {
    this.routerService.navigateToCards();
  }

  setMonthAndYear(normalizedMonthAndYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>): void {
    const ctrlValue = this.cardForm.controls.expiresOn.value || moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.cardForm.controls.expiresOn.setValue(ctrlValue);
    datepicker.close();
  }

  private focusFirstInvalidInput(): void {
    const invalidInput = this.cardFormRef
      .nativeElement
      .querySelectorAll("input.ng-invalid")
      .item(0);

    if (invalidInput) {
      invalidInput.focus();
    }
  }
}
