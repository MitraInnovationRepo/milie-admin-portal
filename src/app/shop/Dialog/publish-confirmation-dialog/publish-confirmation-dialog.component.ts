import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-publish-confirmation-dialog',
  templateUrl: './publish-confirmation-dialog.component.html',
  styleUrls: ['./publish-confirmation-dialog.component.css']
})
export class PublishConfirmationDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data:{
    publish : boolean
    execute:()=>void
  }) { }

  ngOnInit(): void {
  }

  execute(){
    this.data.execute();
  }

  getStatement(){
    return this.data.publish ? 'Do you want to publish this merchant to public?' : 'Do you want to unpublish this merchant to public?'
  }
}
