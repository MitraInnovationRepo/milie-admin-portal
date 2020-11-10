import { NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER } from 'ngx-ui-loader';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/material';
import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';
import { BulkUploadRoutes } from './bulk-upload.routing';
import { BulkUploadComponent } from './bulk-upload.component';
import { BulkUploadService } from './bulk-upload.service';
import {MatStepperModule} from '@angular/material/stepper';
import { ShopService } from 'app/shop/shop.service';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
    fgsColor: "#ef5350",
    fgsType: SPINNER.ballScaleMultiple, // foreground spinner type
    hasProgressBar:false,
  };

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(BulkUploadRoutes),
        FormsModule,
        MaterialModule,
        MatSelectModule,
        NgxUiLoaderModule.forRoot(ngxUiLoaderConfig)
    ],
    declarations: [
        BulkUploadComponent
    ],
    providers: [BulkUploadService, ShopService]
})

export class BulkUploadModule { }