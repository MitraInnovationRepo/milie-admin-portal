import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { MessageService } from "app/shared/services/message.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { MerchantSummary } from "../merchant-summary";
import { MenuService } from "../menu.service";

@Component({
  selector: "app-merchant-list",
  templateUrl: "./merchant-list.component.html",
  styleUrls: ["./merchant-list.component.css"],
})
export class MerchantListComponent implements OnInit {
  displayedColumns: string[] = [
    "shopCode",
    "type",
    "name",
    "city",
    "primaryPhoneNumber",
    "status",
    "menuStatus",
    "action",
  ];
  dataSource: MatTableDataSource<MerchantSummary>;
  summaryList: MerchantSummary[] = [];
  cityFilterList: MerchantSummary[] = [];
  selectedTown = "";
  selectedMenuType = "All";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private menuService: MenuService,
    private ngxService: NgxUiLoaderService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getShops();
  }

  getShops() {
    this.ngxService.start();
    this.menuService.getMerchants(-1).subscribe(
      (result) => {
        this.setTableData(result);
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

  setTableData(result: MerchantSummary[]) {
    this.summaryList = [];
    result.forEach((element) => {
      if (element.status == 1 || element.status == 5) {
        element.displayCity = element.city != null ? element.city.name : "";
        element.displayStatus = this.getStatus(element.status);
        this.summaryList.push(element);
      }
    });
    this.filterMenuStatus(this.selectedMenuType);
  }

  getStatus(status) {
    switch (status) {
      case 1:
        return "Published";
      case 5:
        return "Approved";
    }
  }

  updateShopMenu(id) {
    // this.router.navigate(["/menu/edit/" + id + "/hours"], {
    //   state: { data: id, update: true },
    // });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterCity(id) {
    if (id != "") {
      this.ngxService.start();
      this.menuService.getMerchants(id).subscribe(
        (result) => {
          this.setTableData(result);
          this.ngxService.stop();
        },
        (error) => {
          this.ngxService.stop();
          error.status === 400
            ? this.messageService.snakBarErrorMessage("Error in getting data")
            : this.messageService.snakBarErrorMessage(error.error.message);
        }
      );
    } else {
      this.getShops();
    }
  }

  filterMenuStatus(value) {
    this.selectedMenuType = value;
    let filteredSummaryList: MerchantSummary[];
    if (value == "All") {
      filteredSummaryList = this.summaryList;
    } else if (value == "Uploaded") {
      filteredSummaryList = this.summaryList.filter(
        (summary) => summary.menuUploaded
      );
    } else {
      filteredSummaryList = this.summaryList.filter(
        (summary) => !summary.menuUploaded
      );
    }
    this.dataSource = new MatTableDataSource(filteredSummaryList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.pageSize = 10;
    this.dataSource.sort = this.sort;
  }
}
