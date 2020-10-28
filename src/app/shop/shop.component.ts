import { OnInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ShopSummary } from './shop-summary';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ShopService } from './shop.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
    displayedColumns: string[] = ['shopName', 'city', 'openingHour', 'closingHour', 'status'];
    dataSource: MatTableDataSource<ShopSummary>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private ngxService: NgxUiLoaderService, private shopService: ShopService, private router: Router){}

    ngOnInit(): void {
        this.ngxService.start();
        this.getShops();
    }

    getShops(){
        this.shopService.getShops()
        .subscribe(
            result => {
                this.dataSource = new MatTableDataSource(result);
                this.dataSource.paginator = this.paginator;
                this.dataSource.paginator.pageSize = 10;
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

    openShop(id){
        this.router.navigate(['/shop/add/' + id]); 
    }
}