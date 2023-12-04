import { Injectable } from '@angular/core';
import { ThreeDDice } from 'dddice-js';
import { BehaviorSubject } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class DddiceService {

  private BASEURL = "https://dddice.com/api/1.0/";
  private HEADERS = {
    "Authorization": "Bearer isXuAObM4NsKhv5A1OEj6Vk9lQeOwpDjRWFeqn0Vfa5e044d",
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
  private APIKEY = "isXuAObM4NsKhv5A1OEj6Vk9lQeOwpDjRWFeqn0Vfa5e044d";

  public dddice: ThreeDDice | undefined;
  public authenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public roomConnected: BehaviorSubject<boolean> = new BehaviorSubject(false);
  
  constructor(private firebaseService: FirebaseService, private notification: NotificationService) {
    this.firebaseService.user.subscribe(user => {
      if(user && user.dddiceToken !== ""){
        this.dddiceInit(user.dddiceToken).then((dddice) => {
          this.authenticated.next(true);
          if (user.privateSlug) {
            dddice.connect(user.privateSlug);
          }
        }).catch((error) => { this.authenticated.next(false); })
      }
    });
  }

  // ngOnInit() {}

  public async dddiceInit(token: string): Promise<ThreeDDice> {
    const canvas = document.getElementById("dddice") as HTMLCanvasElement;
    this.dddice = new ThreeDDice(canvas, token, { autoClear: 3, dice: { drawOutlines: false } });
    this.dddice.start();
    this.notification.openSnackBar("DDDice: inizializzato", "check", 2000, 'limegreen');
    return this.dddice;
  }

  public async getActivationCode(): Promise<any> {
    const response = await fetch(this.BASEURL + 'activate', {
      method: "POST",
      headers: this.HEADERS,
    });
    return await response.json();
  }

  public async readActivationCode(code: string, secret: string): Promise<any> {
    const response = await fetch(this.BASEURL + 'activate/' + code, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Secret " + secret,
      }
    });
    return await response.json();
  }

  public async createRoom(token: string): Promise<any> {
    let body = {
      "is_public": true,
      "name": "dungeonsCompanion",
      "passcode": "*******",
    };

    const response = await fetch(this.BASEURL + 'room', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Bearer " + token,
      },
      body: JSON.stringify(body),
    });
    return await response.json();
  }

}
