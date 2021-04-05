import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-merchant-delete-dialog',
  templateUrl: './merchant-delete-dialog.component.html',
  styleUrls: ['./merchant-delete-dialog.component.css']
})
export class MerchantDeleteDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data:{
    delete:()=>void
  }) { }

  ngOnInit(): void {
  }

  delete(){
    this.data.delete();
  }

}
