import { Component, OnInit, Inject } from '@angular/core';
import { PaymentService } from '../payment.service';
import { ShopAccount } from '../shop-account';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
    selector: 'app-shop-account-dialog',
    templateUrl: './shop-account-dialog.component.html'
})
export class ShopAccountDialogComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { shopCode: string }, private paymentService: PaymentService,
    private ngxService: NgxUiLoaderService) { }
    shopAccount: ShopAccount;

    ngOnInit() {
        this.ngxService.start();

        this.paymentService.getShopAccounts(this.data.shopCode)
            .subscribe(
                result => {
                    this.shopAccount = result;
                    this.ngxService.stop();
                }
            )
    }
} 