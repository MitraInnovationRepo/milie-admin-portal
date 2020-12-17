import { Component, ViewChild } from '@angular/core';
import { PendingPayment } from './pending-payment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PaymentService } from './payment.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageService } from 'app/shared/services/message.service';
import { SelectionModel } from '@angular/cdk/collections';
import { ShopAccountDialogComponent } from './dialog/shop-account-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PaymentPendingOrderComponent } from './dialog/payment-pending-order-dialog.component';
import { FormControl } from '@angular/forms';
import { PaymentsRequest } from './payments-request';
import { Router } from '@angular/router';
import { PaymentHistoryComponent } from './dialog/payment-history-dialog.component';
import { error } from 'protractor';

@Component({
    selector: 'app-payments',
    templateUrl: './payments.component.html',
    styleUrls: ['./payments.component.css']
})
export class PaymentsComponent {
    pendingPaymentList: PendingPayment[];
    displayedColumns: string[] = ['select', 'shopCode', 'shopName', 'startDate', 'endDate', 'mobileNumber', 'orderCount', 'orderAmount', 'commissionRate', 'commissionAmount', 'totalPayable', 'orders', 'account', 'payments'];
    dataSource: MatTableDataSource<PendingPayment>;
    selection = new SelectionModel<PendingPayment>(true, []);
    date = new FormControl(new Date());
    paymentStatus: string;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private paymentService: PaymentService, private ngxService: NgxUiLoaderService,
        private messageService: MessageService, private dialog: MatDialog, private router: Router) { }

    ngOnInit(): void {
        this.paymentStatus = "pending";
        this.ngxService.start();
        this.getPayments();
    }

    getPayments() {
        this.paymentService.getPendingPayments(this.date.value)
            .subscribe(
                result => {
                    this.pendingPaymentList = result;
                    this.dataSource = new MatTableDataSource(result.filter(i => i.totalPayable > 0));
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this.ngxService.stop();
                },
                error => {
                    this.ngxService.stop();
                    console.log(error);
                    this.messageService.snakBarErrorMessage(error.error.message);
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

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource?.data.length;
        return numSelected === numRows;
    }

    checkboxLabel(row?: PendingPayment): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row}`;
    }

    openAccountDialog(shopCode) {
        let dialogRef = this.dialog.open(ShopAccountDialogComponent, {
            width: '600px',
            data: { shopCode: shopCode }
        });
    }

    openOrdersDialog(shopCode) {
        let dialogRef = this.dialog.open(PaymentPendingOrderComponent, {
            width: '1000px',
            data: { shopCode: shopCode, date: this.date.value }
        });
    }

    openPaymentHistoryDialog(shopCode) {
        let dialogRef = this.dialog.open(PaymentHistoryComponent, {
            width: '1000px',
            data: { shopCode: shopCode }
        });
    }

    onPaymentStatusChange() {
        var paymentList;
        if (this.paymentStatus === "pending") {
            paymentList = this.pendingPaymentList.filter(i => i.totalPayable > 0);
        }
        else if (this.paymentStatus === "paid") {
            paymentList = this.pendingPaymentList.filter(i => i.totalPayable == 0);
        }
        if (this.paymentStatus === "all") {
            paymentList = this.pendingPaymentList;
        }
        this.dataSource = new MatTableDataSource(paymentList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    postPayment() {
        this.ngxService.start();
        var shopIdList = [];
        this.selection.selected.forEach(row => {
            shopIdList.push(row.shopCode);
        });
        var paymentRequest = new PaymentsRequest();
        paymentRequest.requestingDate = this.date.value;
        paymentRequest.shopIdList = shopIdList;
        this.paymentService.postPayments(paymentRequest)
            .subscribe(
                result => {
                    this.ngxService.stop();
                    this.messageService.snakBarSuccessMessage("Payment posted successfully");
                    this.router.routeReuseStrategy.shouldReuseRoute = function () {
                        return false;
                    }
                    this.router.onSameUrlNavigation = 'reload';
                    this.router.navigate(['/payment']);
                },
                error => {
                    this.ngxService.stop();
                    this.messageService.snakBarErrorMessage(error.error.error_description);
                }
            );
    }
    
    onDateChange(){
        this.paymentStatus = "pending";
        this.ngxService.start();
        this.getPayments();
    }
}
