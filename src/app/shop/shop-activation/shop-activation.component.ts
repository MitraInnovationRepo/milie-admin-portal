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
  selector: 'app-shop-activation',
  templateUrl: './shop-activation.component.html',
  styleUrls: ['./shop-activation.component.css']
})
export class ShopActivationComponent implements OnInit {

  displayedColumns: string[] = ['merchatnCode', 'merchantName', 'City', 'mobileNumber', 'status', 'action'];
  dataSource: MatTableDataSource<MerchantSummary>;
  summaryList: MerchantSummary[] = [];
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
      if (element.status == 3 || element.status == 5 || element.status == 6) {
        element.displayCity = element.city != null ? element.city.name :""
        element.displayStatus = this.getStatus(element.status);
        this.summaryList.push(element);
      }
    });
    this.dataSource = new MatTableDataSource(this.summaryList);
  }

  getStatus(status) {
    switch (status) {
      case 3:
        return 'Pending'
      case 5:
        return 'Approved'
      case 6:
        return 'Rejected'        
    }
  }

  approwShop(id) {
    this.router.navigate(['/shop/activation/view'], { state: { data: id, update: false } });
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
