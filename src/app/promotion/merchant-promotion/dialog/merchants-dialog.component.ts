import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { PromotionService } from '../../promotion.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
    selector: 'merchants-dialog',
    templateUrl: './merchants-dialog.component.html'
})
export class MerchantDialogComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { id: number }, private promotionService: PromotionService, private ngxService: NgxUiLoaderService) { }
    displayedColumns: string[] = ['merchantName','telephoneNumber'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    dataSource;

    ngOnInit() {
        this.ngxService.start();
        this.promotionService.getPromotionMerchants(this.data.id)
            .subscribe(
                result => {
                    var patchResult = [];
                    for (var i in result) {
                      patchResult.push(result[i]);
                    }
                    this.dataSource = new MatTableDataSource(patchResult);
                    this.dataSource.paginator = this.paginator;
                    this.ngxService.stop();
                }
            )
    }
} 