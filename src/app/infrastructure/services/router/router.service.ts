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

  navigateToSignin(): void {
    this.router.navigateByUrl("/auth/signin");
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
