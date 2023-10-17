import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../components/utilities/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private _snackBar: MatSnackBar) { }

  public openSnackBar(message: string, icon?: string, duration?: number) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['custom-snackbar'];
    config.duration = duration || 3000;
    config.data = { message: message, icon: icon || '' };

    this._snackBar.openFromComponent(SnackbarComponent, {
      data: { message },
      ...config
    });
  }
}
