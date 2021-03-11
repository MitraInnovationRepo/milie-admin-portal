import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { PromotionService } from '../../promotion.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { MessageService } from 'app/shared/services/message.service';


@Component({
    selector: 'promotion-delete-dialog',
    templateUrl: './promotion-delete-dialog.component.html'
})
export class PromotionDeleteDialogComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { id: number, getPromotions },
        private promotionService: PromotionService,
        private ngxService: NgxUiLoaderService,
        private router: Router,
        private messageService: MessageService,) { }

    id: number;

    ngOnInit() {
        this.id = this.data.id;
    }
    deletePromotion() {
        this.ngxService.start();
        this.promotionService.deleteMerchantPromotion(this.id)
            .subscribe(
                result => {
                    this.ngxService.stop();
                    if (result === 1) {
                        this.messageService.snakBarErrorMessage('There are active merchants for this promotion!');
                    } else {
                        this.messageService.snakBarSuccessMessage('Promotion Deleted Successfully');
                    }
                    this.data.getPromotions()
                }, error => {
                    this.messageService.snakBarSuccessMessage('Error in Promotion Deletion');

                }
            );
    }
} 