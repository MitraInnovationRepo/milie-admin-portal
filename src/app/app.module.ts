import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxUiLoaderConfig, NgxUiLoaderModule, PB_DIRECTION, POSITION, SPINNER } from 'ngx-ui-loader';
import { AuthInterceptor } from './core/interceptor/auth.interceptor';
import { MaterialModule } from './material';
import { CoreModule } from './core/core.module';
import { MAT_DATE_LOCALE,  } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';


const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsColor: "#ef5350",
  fgsType: SPINNER.ballScaleMultiple, // foreground spinner type
  hasProgressBar: false,
};

@NgModule({
  imports: [
    BrowserAnimationsModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    NgSelectModule,
    MaterialModule,
    CoreModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig)
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
