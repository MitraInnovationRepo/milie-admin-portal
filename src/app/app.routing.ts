import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './auth/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  }, {
    path: 'auth',
    component: LoginComponent,
    children: [{
      path: '',
      loadChildren: './auth/auth.module#AuthModule'
    }]
  },
  {
    path: 'dashboard',
    component: AdminLayoutComponent,
    children: [{
      path: '',
      loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
    }]
  },
  {
    path: 'promotion',
    component: AdminLayoutComponent,
    children: [{
      path: '',
      loadChildren: './promotion/promotion.module#PromotionModule',
    }]
  },
  {
    path: 'shop',
    component: AdminLayoutComponent,
    children: [{
      path: '',
      loadChildren: './shop/shop.module#ShopModule',
    }]
  },
  {
    path: 'bulk-upload',
    component: AdminLayoutComponent,
    children: [{
      path: '',
      loadChildren: './bulk-upload/bulk-upload.module#BulkUploadModule',
    }]
  },
  {
    path: 'payment',
    component: AdminLayoutComponent,
    children: [{
      path: '',
      loadChildren: './payment/payment.module#PaymentModule',
    }]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
