import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { Product } from "app/menu/Product";
import { FileService } from "app/shared/services/file.service";
import { MessageService } from "app/shared/services/message.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { MenuService } from "../../menu.service";

@Component({
  selector: "app-menu-item",
  templateUrl: "./menu-item.component.html",
  styleUrls: ["./menu-item.component.css"],
})
export class MenuItemComponent implements OnInit {
  displayedColumns: string[] = [
    // "id",
    // "image",
    "name",
    // "menus",
    "category",
    "price",
    "sellingPrice",
    "lastModifiedDate",
    // "history",
    "action",
  ];
  dataSource: MatTableDataSource<Product>;
  productList: Product[] = [];
  shopId: Number;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private menuService: MenuService,
    private ngxService: NgxUiLoaderService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private fileService: FileService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.getAllShopProducts();
  }

  getAllShopProducts() {
    this.ngxService.start();
    this.shopId = Number(this.route.parent.parent.snapshot.paramMap.get("id"));
    this.menuService.getAllShopProducts(this.shopId).subscribe(
      (result: any) => {
        this.ngxService.stop();
        this.productList = result.data;
        this.dataSource = new MatTableDataSource(this.productList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator.pageSize = 10;
        this.dataSource.sort = this.sort;
        this.ngxService.stop();
      },
      (error) => {
        this.ngxService.stop();
        error.status === 400
          ? this.messageService.snakBarErrorMessage("Error in getting data")
          : this.messageService.snakBarErrorMessage(error.error.message);
      }
    );
  }

  addItem() {
    this.router.navigate(["menu/edit/" + this.shopId + "/item/add"], {
      state: { data: this.shopId, update: true },
    });
  }

  updateShopMenu(id) {
    // this.router.navigate(
    //   ["/menu/edit/" + this.shopId + "/category/edit/" + id],
    //   {
    //     state: { data: id, update: true },
    //   }
    // );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getProductImage(imageName: string) {
    this.fileService.getFileUrl(imageName).subscribe(
      (res) => {
        let objectURL = URL.createObjectURL(res);
        let image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        return image;
      },
      (err) => {
        this.messageService.snakBarErrorMessage("Something went wrong.");
      }
    );
  }
}
