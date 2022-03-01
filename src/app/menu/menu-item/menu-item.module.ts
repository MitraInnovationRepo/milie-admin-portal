import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AddMenuItemComponent } from "./add-menu-item/add-menu-item.component";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "app/material";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatChipsModule } from "@angular/material/chips";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxFileDropModule } from "ngx-file-drop";
import { NgxUiLoaderConfig, NgxUiLoaderModule, SPINNER } from "ngx-ui-loader";
import { menuItemRoutes } from "./menu-item.routing";
import { MenuItemComponent } from "./menu-item/menu-item.component";
import { AddItemHoursComponent } from "./add-item-hours/add-item-hours.component";
import { MatSelectModule } from "@angular/material/select";

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsColor: "#ef5350",
  fgsType: SPINNER.ballScaleMultiple, // foreground spinner type
  hasProgressBar: false,
};

@NgModule({
  declarations: [
    AddMenuItemComponent,
    MenuItemComponent,
    AddItemHoursComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(menuItemRoutes),
    MaterialModule,
    MatChipsModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatSelectModule,
    NgxFileDropModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
  ],
})
export class MenuItemModule {}
