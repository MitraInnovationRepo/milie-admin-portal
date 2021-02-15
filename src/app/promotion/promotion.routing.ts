import { Routes } from '@angular/router';
import { PromotionComponent } from './promotion.component';
import { PromotionCreationComponent } from './promotion-creation.component';
import { MerchantPromotionComponent } from './merchant-promotion/merchant-promotion.component';
import { MerchantPromotionCreationComponent } from './merchant-promotion/merchant-promotion-creation.component'


export const PromotionRoutes: Routes = [
    { path: '', component: PromotionComponent },
    { path: 'add', component: PromotionCreationComponent },
    {
        path: 'add/:id',
        component: PromotionCreationComponent
    },
    { path: 'merchant', component: MerchantPromotionComponent },
    { path: 'merchant/add', component: MerchantPromotionCreationComponent },
    { path: 'merchant/add/:id', component: MerchantPromotionCreationComponent }
];
