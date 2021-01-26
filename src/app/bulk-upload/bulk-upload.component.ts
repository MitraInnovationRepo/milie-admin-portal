import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ShopSummary } from 'app/shop/shop-summary';
import { ShopService } from 'app/shop/shop.service';
import { BulkUploadService } from './bulk-upload.service';
import { MessageService } from 'app/shared/services/message.service';

@Component({
    selector: 'app-bulk-upload',
    templateUrl: './bulk-upload.component.html',
    styleUrls: ['./bulk-upload.component.css']
})
export class BulkUploadComponent implements OnInit {
    shopList: ShopSummary[];
    productTypeFile: File;
    productFile: File;
    productTypeShopId;
    productTypeCount;
    productShopId;
    productCount;
    productTypeUploaded: boolean = false;
    productUploaded: boolean = false;

    constructor(private _formBuilder: FormBuilder, private shopService: ShopService,
        private bulkUploadService: BulkUploadService, private messageService: MessageService) { }

    ngOnInit() {
        this.shopService.getShops()
            .subscribe(
                result => {
                    this.shopList = result;
                }
            )
    }

    onProductTypeFileSelect(event) {
        this.productTypeFile = event.target.files[0];
        this.productTypeUploaded = true;
    }

    onProductFileSelect(event) {
        this.productFile = event.target.files[0];
        this.productUploaded = true;
    }

    uploadProductTypes() {
        this.messageService.snakBarSuccessMessage("Product Type Creation process will be running in the background. You are free to navigate to a different page. You can always check the Product Type count with 'Check Product Type Count' Button")
        this.bulkUploadService.uploadProductType(this.productTypeShopId, this.productTypeFile)
            .subscribe(
                result => {
                    this.messageService.snakBarSuccessMessage("Product Type Creation Complete");
                },
                error => {
                    this.messageService.snakBarErrorMessage("Product Type Creation Failed");
                }
            );
    }

    uploadProducts() {
        this.messageService.snakBarSuccessMessage("Product Creation process will be running in the background. You are free to navigate to a different page. You can always check the Product Type count with 'Check Product Count' Button")
        this.bulkUploadService.uploadProduct(this.productShopId, this.productFile)
            .subscribe(
                result => {
                    this.messageService.snakBarSuccessMessage("Product Creation Complete");
                },
                error => {
                    this.messageService.snakBarErrorMessage("Product Creation Failed");
                }
            );
    }

    getProductTypeCount() {
        this.bulkUploadService.getProductTypeCount(this.productTypeShopId)
            .subscribe(
                result => {
                    this.productTypeCount = result;
                }
            )
    }

    getProductCount() {
        this.bulkUploadService.getProductCount(this.productShopId)
            .subscribe(
                result => {
                    this.productCount = result;
                }
            )
    }
}