import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MenuHoursComponent } from "./menu-hours/menu-hours.component";
import { RouterModule, Routes } from "@angular/router";
import { MaterialModule } from "app/material";
import { MatChipsModule } from "@angular/material/chips";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RangeSliderComponent } from "./range-slider/range-slider.component";
import { NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER } from "ngx-ui-loader";
import { menuHourRoutes } from "./menu-hours.routing";

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsColor: "#ef5350",
  fgsType: SPINNER.ballScaleMultiple, // foreground spinner type
  hasProgressBar: false,
};

@NgModule({
  declarations: [MenuHoursComponent, RangeSliderComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(menuHourRoutes),
    MaterialModule,
    MatChipsModule,
    ReactiveFormsModule,
    FormsModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
  ],
})
export class MenuHoursModule { }
