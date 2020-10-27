import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { PromotionRoutes } from './promotion.routing';
import { PromotionCreationComponent } from './promotion-creation.component';
import { MaterialModule } from 'app/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { PromotionComponent } from './promotion.component';
import { PromotionService } from './promotion.service';
import { NgxUiLoaderConfig, SPINNER, NgxUiLoaderModule } from 'ngx-ui-loader';


const ngxUiLoaderConfig: NgxUiLoaderConfig = {
    fgsColor: "#ef5350",
    fgsType: SPINNER.ballScaleMultiple, // foreground spinner type
    hasProgressBar:false,
  };

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(PromotionRoutes),
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        MatRippleModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        MatDatepickerModule,
        MatIconModule,
        MatCheckboxModule,
        MatDividerModule,
        MatCardModule,
        MatListModule,
        NgxUiLoaderModule.forRoot(ngxUiLoaderConfig)
    ],
    declarations: [
        PromotionCreationComponent,
        PromotionComponent
    ],
    providers: [PromotionService]
})

export class PromotionModule { }
