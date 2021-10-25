import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MenuHoursComponent } from "./menu-hours/menu-hours.component";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "app/material";
import { MatChipsModule } from "@angular/material/chips";
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [MenuHoursComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: "", component: MenuHoursComponent }]),
    MaterialModule,
    MatChipsModule,
    FormsModule
  ],
})
export default class MenuHoursModule {}
