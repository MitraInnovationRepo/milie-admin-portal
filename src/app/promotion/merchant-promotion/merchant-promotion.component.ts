import { Component, OnInit, ViewChild } from '@angular/core';
import { Promotion } from './../promotion';
import { PromotionService } from './../promotion.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageService } from 'app/shared/services/message.service';
import { MerchantDialogComponent } from './dialog/merchants-dialog.component'
import { PromotionDeleteDialogComponent } from './dialog/promotion-delete-dialog.component'
import { MatDialog } from '@angular/material/dialog';

import { element } from 'protractor';


@Component({
    selector: 'app-merchant-promotion',
    templateUrl: './merchant-promotion.component.html',
    styleUrls: ['./merchant-promotion.component.css']
})
export class MerchantPromotionComponent implements OnInit {


    displayedColumns: string[] = ['promotionType', 'name', 'allMerchants', 'status', 'action'];
    dataSource: MatTableDataSource<Promotion>;
    merchantPromotionsList = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private promotionService: PromotionService, private router: Router, private ngxService: NgxUiLoaderService,
        private messageService: MessageService, private dialog: MatDialog) { }

    ngOnInit(): void {
        this.ngxService.start();
        this.getPromotions();
    }

    getPromotions() {
        this.promotionService.getMerchantPromotions()
            .subscribe(
                result => {
                    this.dataSource = new MatTableDataSource(result);
                    this.merchantPromotionsList = result;
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

    openPromotion(data) {
        this.router.navigate(['/promotion/merchant/view'], { state: { data: data, update: false } });
    }

    updatePromotion(data) {
        this.router.navigate(['/promotion/merchant/add/' + data.id], { state: { data: data, update: true } });
    }

    viewMerchants(id) {
        let dialogRef = this.dialog.open(MerchantDialogComponent, {
            width: '400px',
            data: { id: id }
        });
    }

    deletePromotion(id) {
        let dialogDeletePromotionRef = this.dialog.open(PromotionDeleteDialogComponent, {
            width: '400px',
            data: {
                id: id,
                getPromotions: () => {
                    this.getPromotions()
                }
            }
        });
    }
}
