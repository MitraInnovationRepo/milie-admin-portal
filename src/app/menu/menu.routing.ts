import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MenuComponent } from "./menu.component";
import { MerchantListComponent } from "./merchant-list/merchant-list.component";

export const menuRoutes: Routes = [
  {
    path: "",
    component: MerchantListComponent,
  },
  {
    path: "edit/:id",
    component: MenuComponent,
    children: [
      {
        path: "hours",
        loadChildren: "./menu-hours/menu-hours.module#MenuHoursModule",
      },
      {
        path: "category",
        loadChildren: "./menu-category/menu-category.module#MenuCategoryModule",
      },
    ],
  },
];

