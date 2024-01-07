import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar-dice',
  templateUrl: './snackbar-dice.component.html',
  styleUrl: './snackbar-dice.component.scss'
})
export class SnackbarDiceComponent {
  constructor(
    public snackbar: MatSnackBar,
    @Inject(MAT_SNACK_BAR_DATA) public data: {message: string, icon: string, color:string} ) { }

  public close() {
    this.snackbar.dismiss();
  }
}
