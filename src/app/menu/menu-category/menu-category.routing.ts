import { Routes } from "@angular/router";
import { AddMenuCategoryComponent } from "./add-menu-category/add-menu-category.component";
import { MenuCategoryComponent } from "./menu-category/menu-category.component";

export const menuCategoryRoutes: Routes = [
  { path: "", component: MenuCategoryComponent },
  { path: "add", component: AddMenuCategoryComponent },
  {
    path: "edit/:productTypeId",
    component: AddMenuCategoryComponent,
  },
];
