import { ShopService } from './shop.service';
import { ShopComponent } from './shop.component';
import { NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER } from 'ngx-ui-loader';
import { ShopRoutes } from './shop.routing';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { NgModule } from '@angular/core';
import { ShopCreationComponent } from './shop-creation.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
    fgsColor: "#ef5350",
    fgsType: SPINNER.ballScaleMultiple, // foreground spinner type
    hasProgressBar:false,
  };

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ShopRoutes),
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        MaterialModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        MatDatepickerModule,
        MatInputModule,
        MatCheckboxModule,
        MatDividerModule,
        MatCardModule,
        MatInputModule,
        NgxUiLoaderModule.forRoot(ngxUiLoaderConfig)
    ],
    declarations: [
        ShopComponent, ShopCreationComponent
    ],
    providers: [ShopService]
})

export class ShopModule { }