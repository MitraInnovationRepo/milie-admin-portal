import { NgModule,LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import locale from '@angular/common/locales/en';
import { UserService } from './service/user.service';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    Title,
    {
        provide: LOCALE_ID,
        useValue: 'en'
    },
    DatePipe,
    UserService
]
})
export class CoreModule { 
  constructor() {
    registerLocaleData(locale);
  }
}



