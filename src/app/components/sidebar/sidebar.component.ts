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
  { path: '', title: 'Promotions', icon: 'card_giftcard', class: '', subTitle: [ { path: '/promotion/customer', title: 'Customer' }] },
  { path: '/shop', title: 'Shops', icon: 'storefront', class: '' },
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
