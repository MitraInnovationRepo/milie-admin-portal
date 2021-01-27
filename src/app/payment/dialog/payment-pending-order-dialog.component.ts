import { OnInit, Inject, Component, ViewChild } from '@angular/core';
import { PaymentPendingOrder } from '../payment-pending-order';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentService } from '../payment.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageService } from 'app/shared/services/message.service';
import { OrderConstants } from "../../core/constant";

@Component({
    selector: 'app-payment-pending-order-dialog',
    templateUrl: './payment-pending-order-dialog.component.html',
    styleUrls: ['./payment-dialog.component.css']
})
export class PaymentPendingOrderComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { shopCode: string, date: Date, isPaid: boolean }, private paymentService: PaymentService,
        private ngxService: NgxUiLoaderService, private messageService: MessageService) { }

    displayedColumns: string[] = ['orderNo', 'orderDate', 'customerName', 'amount', 'discount', 'netAmount'];
    dataSource: MatTableDataSource<PaymentPendingOrder>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    
    ngOnInit() {
        this.ngxService.start();
        if(this.data.isPaid) {
            this.paymentService.getPaymentPaidOrders(this.data.shopCode, this.data.date)
            .subscribe(
                result => {                  
                    result.forEach(function(item, index) {                    
                        item.orderNo = OrderConstants.OrderPrefix + item.orderNo;
                      });
                      
                    this.dataSource = new MatTableDataSource(result);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this.ngxService.stop();
                },
                error => {
                    this.messageService.snakBarErrorMessage("Error Fetching Orders");
                }
            )
        }
        else {
        this.paymentService.getPaymentPendingOrders(this.data.shopCode, this.data.date)
            .subscribe(
                result => {
                    result.forEach(function(item, index) {                    
                        item.orderNo = OrderConstants.OrderPrefix + item.orderNo;
                      });

                    this.dataSource = new MatTableDataSource(result);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this.ngxService.stop();
                },
                error => {
                    this.messageService.snakBarErrorMessage("Error Fetching Orders");
                }
            )
        }
    }
} 