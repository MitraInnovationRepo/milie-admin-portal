import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private snackBarSource = new BehaviorSubject(false);

  constructor(private snakBar: MatSnackBar) { }

  snakBarSuccessMessage(message: string) {
    this.snakBar.open(message, '',
      {
        duration: 5000,
        panelClass: ['success-snackbar']
      }
    )
  }

  snakBarErrorMessage(message: string) {
    this.snakBar.open(message, '',
      {
        duration: 5000,
        panelClass: ['failed-snackbar']
      }
    )
  }
}
