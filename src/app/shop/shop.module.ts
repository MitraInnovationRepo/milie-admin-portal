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
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDialogModule} from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { ShopCreationComponent } from './shop-creation.component';
import { ShopRegistrationComponent } from './shop-registration/shop-registration.component';
import { AddNewContactComponent } from './Dialog/add-new-contact/add-new-contact.component';
import { AddWorkingHoursComponent } from './Dialog/add-working-hours/add-working-hours.component';
import { ShopActivationComponent } from './shop-activation/shop-activation.component';
import { ShopPublicationComponent } from './shop-publication/shop-publication.component';
import { MerchantComponent } from './merchant/merchant.component';
import { MerchantDeleteDialogComponent } from './Dialog/merchant-delete-dialog/merchant-delete-dialog.component';
import { ApproveConfirmationDialogComponent } from './Dialog/approve-confirmation-dialog/approve-confirmation-dialog.component';
import { PublishConfirmationDialogComponent } from './Dialog/publish-confirmation-dialog/publish-confirmation-dialog.component';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { InformationDialogComponent } from './Dialog/information-dialog/information-dialog.component';

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
        MatSelectModule,
        MatTooltipModule,
        MatDatepickerModule,
        MatInputModule,
        MatCheckboxModule,
        MatDividerModule,
        MatCardModule,
        MatAutocompleteModule,
        MatDialogModule,
        NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
        MatGoogleMapsAutocompleteModule
    ],
    declarations: [
        ShopComponent, ShopCreationComponent, ShopRegistrationComponent, AddNewContactComponent, AddWorkingHoursComponent, ShopActivationComponent, ShopPublicationComponent, MerchantComponent, MerchantDeleteDialogComponent, ApproveConfirmationDialogComponent, PublishConfirmationDialogComponent, InformationDialogComponent
    ],
    providers: [ShopService]
})

export class ShopModule { }