import { Routes } from "@angular/router";
import { AddMenuItemComponent } from "./add-menu-item/add-menu-item.component";
import { MenuItemComponent } from "./menu-item/menu-item.component";
// import { MenuCategoryComponent } from "./menu-category/menu-category.component";

export const menuItemRoutes: Routes = [
  { path: "", component: MenuItemComponent },
  { path: "add", component: AddMenuItemComponent },
  //   {
  //     path: "edit/:productTypeId",
  //     component: AddMenuCategoryComponent,
  //   },
];
