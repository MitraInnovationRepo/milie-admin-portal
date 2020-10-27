import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BarComponent } from './widgets/bar/bar.component';
import { SearchComponent } from './search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermissionDirective } from './directive/permission.directive';
import { TableComponent } from './components/table/table.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../material';

@NgModule({
  declarations: [
    BarComponent,
    SearchComponent,
    PermissionDirective,
    TableComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  exports:[
    BarComponent,
    SearchComponent,
    TableComponent
  ]
// import { MatInputModule, MatIconModule, MatButtonModule, MatFormFieldModule } from '@angular/material';
})
export class SharedModule { }
