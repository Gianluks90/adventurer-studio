import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../components/utilities/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private _snackBar: MatSnackBar) { }

  /**
   * Apre uno snackbar con un messaggio e un'icona
   * @param message Una stringa contenente il messaggio da moestrare, non esagerare in lunghezza;
   * @param icon Deve essere una stringa e corrispondere al nome di una mat-icon;
   * @param duration (opzionale) Se non indicata è 3000
   * @example openSnackBar("Salvato con successo", "check", 3000) */
  public openSnackBar(message: string, icon: string, duration?: number, color?:string) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['custom-snackbar'];
    config.duration = duration || 3000;
    config.data = { message: message, icon: icon, color: color};
    this._snackBar.openFromComponent(SnackbarComponent, {
      data: { message },
      ...config,

    });
  }
}
