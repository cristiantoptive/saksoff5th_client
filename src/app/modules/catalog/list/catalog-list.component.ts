import { Component, OnInit } from "@angular/core";
import { MatSelectChange } from "@angular/material/select";
import { ProductCategoryViewModel } from "@app/infrastructure/interfaces/categories";
import { ProductViewModel } from "@app/infrastructure/interfaces/products";
import { VendorViewModel } from "@app/infrastructure/interfaces/vendors";
import { ProductCategoryService } from "@app/infrastructure/services/product-category/product-category.service";
import { ProductsService } from "@app/infrastructure/services/products/products.service";
import { SnackbarService } from "@app/infrastructure/services/snackbar/snackbar.service";
import { VendorsService } from "@app/infrastructure/services/vendors/vendors.service";

@Component({
  templateUrl: "./catalog-list.component.html",
  styleUrls: ["./catalog-list.component.scss"],
})
export class CatalogListComponent implements OnInit {
  public isBusy: boolean;

  public products: ProductViewModel[];
  public vendors: VendorViewModel[];
  public categories: ProductCategoryViewModel[];

  public selectedCategory: any;
  public selectedVendor: any;
  public searchText: string;

  public slides = [
    "https://material.angular.io/assets/img/examples/shiba2.jpg",
    "https://material.angular.io/assets/img/examples/shiba2.jpg",
    "https://material.angular.io/assets/img/examples/shiba2.jpg",
  ];

  constructor(
    private vendorService: VendorsService,
    private productService: ProductsService,
    private snackbarService: SnackbarService,
    private categoriesService: ProductCategoryService,
  ) {
  }

  ngOnInit(): void {
    this.isBusy = true;
    this.productService.all()
      .subscribe(products => {
        this.products = products;
        this.isBusy = false;
      }, err => {
        this.isBusy = false;
        this.snackbarService.showSnackbarFailure(err);
      });

    this.categoriesService.all()
      .subscribe(categories => {
        this.categories = categories;
      });

    this.vendorService.all()
      .subscribe(vendors => {
        this.vendors = vendors;
      });
  }

  onSearchCategoryChange($event: MatSelectChange): void {
    console.log($event);
  }

  onSearchVendorChange($event: MatSelectChange): void {
    console.log($event);
  }

  onSearchTextChange(search: string): void {
    console.log(search);
  }

  onClearSearch(): void {
    this.searchText = "";
    this.selectedVendor = [];
    this.selectedCategory = [];
  }

  onAddToCart(product: ProductViewModel): void {
    console.log(product);
  }

  onBuyProduct(product: ProductViewModel): void {
    console.log(product);
  }
}
