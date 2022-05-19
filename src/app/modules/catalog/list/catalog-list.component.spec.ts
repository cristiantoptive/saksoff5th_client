import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { CatalogListComponent } from "./catalog-list.component";

describe("CatalogListComponent", () => {
  let component: CatalogListComponent;
  let fixture: ComponentFixture<CatalogListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogListComponent ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
