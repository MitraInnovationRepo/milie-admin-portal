import { Component, OnInit, ɵConsole } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenitcationService } from 'app/core/service/authenitcation.service';
import { MessageService } from 'app/shared/services/message.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  username: string
  password: string

  constructor(
    private _formBuilder: FormBuilder,
    private loginService: AuthenitcationService,
    private router: Router,
    private messageService: MessageService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {

    this.loginForm = this._formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

  }

  onSubmit(formData: any) {
    this.ngxService.start();
    this.loginService.login(formData)
      .subscribe(
        response => {
          if (response.access_token != null) {
            localStorage.setItem("access_token", response.access_token);
            localStorage.setItem("refresh_token", response.refresh_token);
            this.router.navigate(['/dashboard']);
          }
          else {
            this.ngxService.stop();
            this.messageService.snakBarErrorMessage("Login Failed");
          }
        },
        error => {
          this.ngxService.stop();
          this.messageService.snakBarErrorMessage(error.error.error_description);
        }
      );
  }
}
