import { Injectable, WritableSignal, signal } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { arrayUnion, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../components/utilities/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  // constructor(private _snackBar: MatSnackBar) { }
  constructor(private firebaseService: FirebaseService, private _snackBar: MatSnackBar) {}

  public logs: WritableSignal<any> = signal(null)

  public getSignalLogs(campId: string): void {
    const docRef = doc(this.firebaseService.database, 'logs', campId);
    const unsub = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const log = {
          id: doc.id,
          ...doc.data()
        };
        this.logs.set(log);
      }
    });
  }

  public async newLog(campId: string, log: any): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'logs', campId);
    const newLog = {
      ...log,
      read: false,
      createdAt: new Date()
    }
    return await setDoc(docRef, {
      logs: arrayUnion(newLog)
    }, { merge: true });
  }

  public async updateLogs(campId: string, logs: any[]): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'logs', campId);
    return await setDoc(docRef, {
      logs: logs
    }, { merge: true });
  }

  public async clearLogs(campId: string): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'logs', campId);
    return await setDoc(docRef, {
      logs: []
    }, { merge: true });
  }

  // public async getLogs

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

  public dismissSnackBar() {
    this._snackBar.dismiss();
  }
}
