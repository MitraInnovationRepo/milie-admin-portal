import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-information-dialog',
  templateUrl: './information-dialog.component.html',
  styleUrls: ['./information-dialog.component.css']
})
export class InformationDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    day
    openTime
    closeTime
    invalid
  }) { }

  ngOnInit(): void {
  }

  getStatement() {
    if (this.data.invalid) {
      return "Invalid opening and closing times!"
    } else if (this.data.openTime != null && this.data.closeTime != null) {
      return "Not allowed to overlap " + this.data.day + " " + this.data.openTime + " - " + this.data.closeTime + " working hours!"
    }else {
      return "Not allowed to input working hours on " + this.data.day +"!"
    }

  }
}
