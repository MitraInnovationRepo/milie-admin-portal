import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'app/material';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { NgxUiLoaderConfig, SPINNER, NgxUiLoaderModule } from 'ngx-ui-loader';
import { PaymentsComponent } from './payments.component';
import { PaymentRoutes } from './payment.routing';
import { PaymentService } from './payment.service';
import { ShopAccountDialogComponent } from './dialog/shop-account-dialog.component';
import { PaymentPendingOrderComponent } from './dialog/payment-pending-order-dialog.component';


const ngxUiLoaderConfig: NgxUiLoaderConfig = {
    fgsColor: "#ef5350",
    fgsType: SPINNER.ballScaleMultiple, // foreground spinner type
    hasProgressBar:false,
  };

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(PaymentRoutes),
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        MatRippleModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatCheckboxModule,
        MatDividerModule,
        MatCardModule,
        MatListModule,
        NgxUiLoaderModule.forRoot(ngxUiLoaderConfig)
    ],
    declarations: [
        PaymentsComponent,
        ShopAccountDialogComponent,
        PaymentPendingOrderComponent
    ],
    providers: [PaymentService]
})

export class PaymentModule { }
