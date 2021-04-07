import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MessageService } from 'app/shared/services/message.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PublishConfirmationDialogComponent } from '../Dialog/publish-confirmation-dialog/publish-confirmation-dialog.component';
import { MerchantSummary } from '../merchant-summary';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-shop-publication',
  templateUrl: './shop-publication.component.html',
  styleUrls: ['./shop-publication.component.css']
})
export class ShopPublicationComponent implements OnInit {

  displayedColumns: string[] = ['merchatnCode', 'merchantName', 'City', 'mobileNumber', 'status', 'action'];
  dataSource: MatTableDataSource<MerchantSummary>;
  summaryList: MerchantSummary[] = [];
  id: number;
  selectedTown = "";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private shopService: ShopService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
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
      if (element.status == 1 || element.status == 5 || element.status == 0 || element.status == 2) {
        element.displayCity = element.city != null ? element.city.name : ""
        element.displayStatus = this.getStatus(element.status);
        this.summaryList.push(element);
      }
    });
    this.dataSource = new MatTableDataSource(this.summaryList);
  }

  getStatus(status) {
    switch (status) {
      case 1:
        return 'Published'
      case 2:
        return 'Published'
      case 5:
        return 'Approved'
      case 0:
        return 'Unpublished'
    }
  }

  onPublishOrUnpublish(isPublish: boolean) {
    this.ngxService.start();
    if (isPublish) {
      this.shopService.publishShop(this.id).subscribe(
        result => {
          this.ngxService.stop();
          this.messageService.snakBarSuccessMessage('You have successfully published the merchant');
          this.getShops();
        }, error => {
          this.ngxService.stop();
          error.status === 400 ?
            this.messageService.snakBarErrorMessage("Error in publishing the merchant") :
            this.messageService.snakBarErrorMessage(error.error.message)
        }
      )
    } else {
      this.shopService.unpublish(this.id).subscribe(
        result => {
          this.ngxService.stop();
          this.messageService.snakBarSuccessMessage('You have successfully unpublished the merchant');
          this.getShops();
        }, error => {
          this.ngxService.stop();
          error.status === 400 ?
            this.messageService.snakBarErrorMessage("Error in unpublishing the merchant") :
            this.messageService.snakBarErrorMessage(error.error.message)
        }
      )
    }
  }

  confirmationAction(isPublish: boolean, id: number) {
    this.id = id;
    this.dialog.open(PublishConfirmationDialogComponent, {
      data: {
        publish: isPublish,
        execute: () => {
          this.onPublishOrUnpublish(isPublish);
        }
      }
    });
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
