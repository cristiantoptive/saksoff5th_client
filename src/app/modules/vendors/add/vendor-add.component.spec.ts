import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { VendorAddComponent } from "./vendor-add.component";

describe("VendorAddComponent", () => {
  let component: VendorAddComponent;
  let fixture: ComponentFixture<VendorAddComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorAddComponent ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
