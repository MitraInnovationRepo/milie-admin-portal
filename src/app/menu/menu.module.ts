import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

import { MenuRoutingModule } from "./menu.routing";
import { MerchantListComponent } from "./merchant-list/merchant-list.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "app/material";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDialogModule } from "@angular/material/dialog";
import { NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER } from "ngx-ui-loader";
import { MenuService } from "./menu.service";
import { MatChipsModule } from "@angular/material/chips";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTabsModule } from '@angular/material/tabs';
import { MenuComponent } from "./menu.component";

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsColor: "#ef5350",
  fgsType: SPINNER.ballScaleMultiple, // foreground spinner type
  hasProgressBar: false,
};

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MenuRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    MaterialModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatInputModule,
    MatCheckboxModule,
    MatDividerModule,
    MatCardModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatChipsModule,
    MatToolbarModule,
    MatTabsModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
  ],
  declarations: [MerchantListComponent, MenuComponent],
  providers: [MenuService],
})
export class MenuModule {}
