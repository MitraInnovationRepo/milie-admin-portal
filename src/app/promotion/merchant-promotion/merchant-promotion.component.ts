import { Component, OnInit, ViewChild } from '@angular/core';
import { Promotion } from './../promotion';
import { PromotionService } from './../promotion.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageService } from 'app/shared/services/message.service';


@Component({
  selector: 'app-merchant-promotion',
  templateUrl: './merchant-promotion.component.html',
  styleUrls: ['./merchant-promotion.component.css']
})
export class MerchantPromotionComponent implements OnInit {

  
  displayedColumns: string[] = ['promotionCode', 'name', 'startDate', 'endDate', 'subType', 'action'];
  dataSource: MatTableDataSource<Promotion>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private promotionService: PromotionService, private router: Router, private ngxService: NgxUiLoaderService, 
      private messageService: MessageService) { }

  ngOnInit(): void {
      this.ngxService.start();
      this.getPromotions();
  }

  getPromotions(){
      this.promotionService.getPromotions()
      .subscribe(
          result => {
              this.dataSource = new MatTableDataSource(result);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              this.ngxService.stop();
          }
      );
  }

  applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
      }
  }

  openPromotion(id){
      this.router.navigate(['/promotion/merchant/add/' + id]);
  }

  deletePromotion(id){
      this.ngxService.start();
      this.promotionService.deletePromotion(id)
      .subscribe(
          result => {
              this.getPromotions();
              this.ngxService.stop();
              this.messageService.snakBarSuccessMessage('Promotion Deleted Successfully');
          }
      );
  }

}
