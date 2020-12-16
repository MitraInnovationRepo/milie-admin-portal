import { Component, OnInit, Inject } from '@angular/core';
import { PaymentService } from '../payment.service';
import { ShopAccount } from '../shop-account';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-shop-account-dialog',
    templateUrl: './shop-account-dialog.component.html'
})
export class ShopAccountDialogComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { shopCode: string }, private paymentService: PaymentService) { }
    shopAccount: ShopAccount;

    ngOnInit() {
        this.paymentService.getShopAccounts(this.data.shopCode)
            .subscribe(
                result => {
                    this.shopAccount = result;
                }
            )
    }
} 