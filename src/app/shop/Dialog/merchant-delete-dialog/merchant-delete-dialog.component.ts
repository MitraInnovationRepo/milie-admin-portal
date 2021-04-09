import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-merchant-delete-dialog',
  templateUrl: './merchant-delete-dialog.component.html',
  styleUrls: ['./merchant-delete-dialog.component.css']
})
export class MerchantDeleteDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data:{
    target: number
    delete:()=>void
  }) { }

  ngOnInit(): void {
  }

  delete(){
    this.data.delete();
  }

  getMassege(){
    if (this.data.target && this.data.target ===1 ) {
      return "Are you sure you want to delete this contact person?"
    }else if(this.data.target && this.data.target ===2 ){
      return "Are you sure you want to delete this working hours?"
    }else{
      return "Are you sure you want to delete this document?"
    }
  }

}
