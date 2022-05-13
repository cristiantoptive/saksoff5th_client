import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class RouterService {
  constructor(private router: Router) { }

  navigateToMain(): void {
    this.router.navigateByUrl("/");
  }

  navigateToVendors(): void {
    this.router.navigateByUrl("/vendors");
  }

  navigateToVendorAdd(): void {
    this.router.navigateByUrl("/vendors/add");
  }

  navigateToVendorEdit(id: string): void {
    this.router.navigateByUrl(`/vendors/edit/${id}`);
  }

  navigateToSignin(): void {
    this.router.navigateByUrl("/auth/signin");
  }

  navigateToSignup(): void {
    this.router.navigateByUrl("/auth/signup");
  }

  retrieveParamsFromSnapshot(snapshot: ActivatedRouteSnapshot): any {
    const params: any = { };

    (function mergeParamsFromSnapshot(currSnapshot: ActivatedRouteSnapshot) {
      Object.assign(params, currSnapshot.params);
      currSnapshot.children.forEach(mergeParamsFromSnapshot);
    })(snapshot);

    return params;
  }

  retrieveDataFromSnapshot(snapshot: ActivatedRouteSnapshot): any {
    const params: any = { };

    (function mergeDataFromSnapshot(currSnapshot: ActivatedRouteSnapshot) {
      Object.assign(params, currSnapshot.data);
      currSnapshot.children.forEach(mergeDataFromSnapshot);
    })(snapshot);

    return params;
  }
}
