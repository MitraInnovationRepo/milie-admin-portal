import { Routes } from '@angular/router';
import { PromotionComponent } from './promotion.component';
import { PromotionCreationComponent } from './promotion-creation.component';


export const PromotionRoutes: Routes = [
    { path: '', component: PromotionComponent },
    { path: 'add', component: PromotionCreationComponent },
    {
        path: 'add/:id',
        component: PromotionCreationComponent
    },
];
