import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MessageService } from 'app/shared/services/message.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MerchantSummary } from '../merchant-summary';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.css']
})
export class MerchantComponent implements OnInit {
  displayedColumns: string[] = ['shopCode', 'name', 'city', 'primaryPhoneNumber', 'status', 'online', 'action'];
  dataSource: MatTableDataSource<MerchantSummary>;
  summaryList: MerchantSummary[] = [];
  cityFilterList: MerchantSummary[] = [];
  selectedTown = "";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private shopService: ShopService,
    private ngxService: NgxUiLoaderService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.getShops();
  }

  getShops() {
    this.ngxService.start();
    this.shopService.getMerchants()
      .subscribe(
        result => {
          this.setTableData(result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.paginator.pageSize = 10;
          this.dataSource.sort = this.sort;
          this.ngxService.stop();
        }, error => {
          this.ngxService.stop();
          error.status === 400 ?
            this.messageService.snakBarErrorMessage("Error in getting data") :
            this.messageService.snakBarErrorMessage(error.error.message)
        }
      );
  }

  setTableData(result: MerchantSummary[]) {
    this.summaryList = [];
    result.forEach(element => {
      if (element.status == 1 || element.status == 3 || element.status == 5 || element.status == 2) {
        element.displayCity = element.city != null ? element.city.name :""
        element.displayStatus = this.getStatus(element.status);
        this.summaryList.push(element);
      }
    });
    this.dataSource = new MatTableDataSource(this.summaryList);
  }

  getStatus(status) {
    switch (status) {
      case 1:
        return 'Active'
      case 2:
        return 'Active'
      case 3:
        return 'Pending'
      case 5:
        return 'Approved'
    }
  }

  updateShop(id) {
    this.router.navigate(['/shop/registration/add/' + id], { state: { data: id, update: true } });
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
      this.shopService.getMerchantsByCity(id)
        .subscribe(
          result => {
            console.log(result);
            this.setTableData(result);
            this.dataSource.paginator = this.paginator;
            this.dataSource.paginator.pageSize = 10;
            this.dataSource.sort = this.sort;
            this.ngxService.stop();
          }, error => {
            this.ngxService.stop();
            error.status === 400 ?
              this.messageService.snakBarErrorMessage("Error in getting data") :
              this.messageService.snakBarErrorMessage(error.error.message)
          }
        );
    } else {
      this.getShops();
    }

  }

}
