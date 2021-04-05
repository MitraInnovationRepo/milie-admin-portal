import { Routes } from '@angular/router';
import { ShopComponent } from './shop.component';
import { ShopCreationComponent } from './shop-creation.component';
import { ShopRegistrationComponent } from './shop-registration/shop-registration.component';
import { AddWorkingHoursComponent } from './Dialog/add-working-hours/add-working-hours.component';
import { ShopActivationComponent } from './shop-activation/shop-activation.component';
import { ShopPublicationComponent } from './shop-publication/shop-publication.component';
import { MerchantComponent } from './merchant/merchant.component';


export const ShopRoutes: Routes = [
    { path: 'registration', component: MerchantComponent },
    { path: 'addold', component: ShopCreationComponent },
    { path: 'test', component: AddWorkingHoursComponent },
    { path: 'registration/add', component: ShopRegistrationComponent },
    {
        path: 'registration/add/:id',
        component: ShopRegistrationComponent
    },
    {path : 'activation/view' , component : ShopRegistrationComponent},
    { path: 'activation', component: ShopActivationComponent },
    { path: 'publication', component: ShopPublicationComponent },
];
