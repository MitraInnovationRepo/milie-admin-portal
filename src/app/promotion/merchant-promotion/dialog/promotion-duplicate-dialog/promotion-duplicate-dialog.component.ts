import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { MessageService } from 'app/shared/services/message.service';

@Component({
  selector: 'app-promotion-duplicate-dialog',
  templateUrl: './promotion-duplicate-dialog.component.html',
  styleUrls: ['./promotion-duplicate-dialog.component.css']
})
export class PromotionDuplicateDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { promotion: any, duplicatePromotion },
    private ngxService: NgxUiLoaderService,
    private messageService: MessageService
  ) { }

  promotion: any;

  ngOnInit(): void {
    this.promotion = this.data.promotion;
  }

  duplicate() {
    this.ngxService.start();
    this.data.duplicatePromotion(this.promotion);
  }
}
