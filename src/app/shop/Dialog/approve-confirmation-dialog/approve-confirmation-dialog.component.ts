import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-approve-confirmation-dialog',
  templateUrl: './approve-confirmation-dialog.component.html',
  styleUrls: ['./approve-confirmation-dialog.component.css']
})
export class ApproveConfirmationDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data:{
    approve : boolean
    execute:()=>void
  }) { }

  ngOnInit(): void {
  }

  execute(){
    this.data.execute();
  }

  getStatement(){
    return this.data.approve ? 'Are you sure you want to approve this merchant registration?' : 'Are you sure you want to reject this merchant registration?'
  }
}
