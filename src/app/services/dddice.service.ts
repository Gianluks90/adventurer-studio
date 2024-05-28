import { Injectable, effect } from '@angular/core';
import { ThreeDDice } from 'dddice-js';
import { BehaviorSubject } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { NotificationService } from './notification.service';
import { getAuth } from 'firebase/auth';

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
  // public dddiceCampaign: ThreeDDice | undefined;
  public authenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public roomConnected: BehaviorSubject<boolean> = new BehaviorSubject(false);
  
  constructor(private firebaseService: FirebaseService, private notification: NotificationService) {
    effect(() => {
      const user = this.firebaseService.userSignal();
      if (user) {
        this.dddiceInit(user.dddiceToken).then((dddice) => {
          this.authenticated.next(true);
          if (user.privateSlug) {
            dddice.connect(user.privateSlug);
          }
        }).catch((error) => { this.authenticated.next(false)})
      }
    });
    // this.firebaseService.user.subscribe(user => {
    //   if (user && user['dddiceToken']){
    //     this.dddiceInit(user.dddiceToken).then((dddice) => {
    //       this.authenticated.next(true);
    //       if (user.privateSlug) {
    //         dddice.connect(user.privateSlug);
    //       }
    //     }).catch((error) => { this.authenticated.next(false)})
    //   }
    // });
  }

  public async dddiceInit(token: string): Promise<ThreeDDice> {
    const canvas = document.getElementById("dddice") as HTMLCanvasElement;
    this.dddice = new ThreeDDice(canvas, token, { autoClear: 3, dice: { drawOutlines: false } });
    this.dddice.start();
    this.notification.openSnackBar("DDDice: inizializzato", "check", 1000, 'limegreen');
    return this.dddice;
  }

  // public async dddiceCampaignInit(token: string): Promise<ThreeDDice> {
  //   const canvas = document.getElementById("dddiceCampaign") as HTMLCanvasElement;
  //   this.dddiceCampaign = new ThreeDDice(canvas, token, { autoClear: 3, dice: { drawOutlines: false } });
  //   this.dddiceCampaign.start();
  //   this.notification.openSnackBar("DDDice Campagna: inizializzato", "check", 1000, 'limegreen');
  //   return this.dddiceCampaign;
  // }

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

  public async createRoom(token: string, name: string, passcode: string): Promise<any> {
    let body = {
      "is_public": true,
      "name": name,
      "passcode": passcode
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

  public async joinRoom(token: string, slug: string, passcode: string): Promise<any> {
    let body = {
      "passcode": passcode
    };

    const response = await fetch(this.BASEURL + 'room/' + slug + '/partecipant', {
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

  public async connectPrivateRoom(token: string, slug: string): Promise<any> {
    this.firebaseService.getUserById(getAuth().currentUser!.uid).then((user) => {
      this.dddice.connect(user.data()['privateSlug']);
    });
  }

}
