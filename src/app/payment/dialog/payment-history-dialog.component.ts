import { OnInit, Inject, Component, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentService } from '../payment.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageService } from 'app/shared/services/message.service';
import { PaymentSummary } from '../payment-summary';

@Component({
    selector: 'app-payment-history-dialog',
    templateUrl: './payment-history-dialog.component.html',
    styleUrls: ['./payment-dialog.component.css']
})
export class PaymentHistoryComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { shopCode: string }, private paymentService: PaymentService,
        private ngxService: NgxUiLoaderService, private messageService: MessageService) { }

    displayedColumns: string[] = ['paymentDate', 'paidAmount'];
    dataSource: MatTableDataSource<PaymentSummary>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    ngOnInit() {
        this.ngxService.start();
        this.paymentService.getPaymentHistory(this.data.shopCode)
            .subscribe(
                result => {
                    this.dataSource = new MatTableDataSource(result);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this.ngxService.stop();
                },
                error => {
                    this.messageService.snakBarErrorMessage("Error Fetching Payments");
                }
            )
    }
} 