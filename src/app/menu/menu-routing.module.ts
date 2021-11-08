import { Routes, RouterModule } from "@angular/router";
import { MenuComponent } from "./menu.component";
import { MerchantListComponent } from "./merchant-list/merchant-list.component";

export const MenuRoutes: Routes = [
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
        loadChildren: "./menu-hours/menu-hours.module",
      },
      {
        path: "category",
        loadChildren: "./menu-category/menu-category.module",
      },
    ],
  },
];
