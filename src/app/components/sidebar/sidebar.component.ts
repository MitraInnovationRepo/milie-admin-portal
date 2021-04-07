import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  subTitle?: any;
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
  { path: '', title: 'Promotions', icon: 'local_parking', class: '', subTitle: [{ path: '/promotion/merchant', title: 'Merchant' }, { path: '/promotion/customer', title: 'Customer' }] },
  { path: '/shop', title: 'Merchants', icon: 'storefront', class: '' , subTitle: [{ path: '/shop/registration', title: 'Registration' }, { path: '/shop/activation', title: 'Activation' } , {path: '/shop/publication' , title: 'Publish'}] },
  { path: '/bulk-upload', title: 'Bulk Upload', icon: 'upload', class: '' },
  { path: '/payment', title: 'Payments', icon: 'money', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  shopName: string;
  displayCity: string;
  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };
}
