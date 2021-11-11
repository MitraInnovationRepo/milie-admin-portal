import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MenuCategoryComponent } from "./menu-category/menu-category.component";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "app/material";
import { MatChipsModule } from "@angular/material/chips";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxUiLoaderConfig, NgxUiLoaderModule, SPINNER } from "ngx-ui-loader";
import { AddMenuCategoryComponent } from "./add-menu-category/add-menu-category.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxFileDropModule } from "ngx-file-drop";

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsColor: "#ef5350",
  fgsType: SPINNER.ballScaleMultiple, // foreground spinner type
  hasProgressBar: false,
};

@NgModule({
  declarations: [MenuCategoryComponent, AddMenuCategoryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: "", component: MenuCategoryComponent },
      { path: "add", component: AddMenuCategoryComponent },
      { path: "edit/:productTypeId", component: AddMenuCategoryComponent },
    ]),
    MaterialModule,
    MatChipsModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxFileDropModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
  ],
})
export default class MenuCategoryModule {}
