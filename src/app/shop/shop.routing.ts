import { Routes } from '@angular/router';
import { ShopComponent } from './shop.component';
import { ShopCreationComponent } from './shop-creation.component';


export const ShopRoutes: Routes = [
    { path: '', component: ShopComponent },
    { path: 'add', component: ShopCreationComponent },
    {
        path: 'add/:id',
        component: ShopCreationComponent
    },
];
