import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CharacterService } from './character.service';

@Injectable({
  providedIn: 'root'
})
export class DiceService {
  private BASE_URL_ROLL = "https://dddice.com/api/1.0/roll/";
  private BASE_URL_ROOM = "https://dddice.com/api/1.0/room/";
  private headers = {
    "Authorization": "Bearer CQSIqORUGw8et99lyxShEdYLWvyq4rmzATYTyftR1ced18ab",
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  public result: BehaviorSubject<number> = new BehaviorSubject(null);
  
  constructor(private http: HttpClient, private charService: CharacterService) { }
  
  public async getRoll(body: any){
    this.http.post(this.BASE_URL_ROLL, body, {headers: this.headers}).subscribe({
      next: (res:any) => {
        if(res){
          this.result.next(res.data.total_value);
        }
      },
      error: err => console.log(err)
    });
  }
  
  createRoom() {

    let body = {
      "is_public": false,
      "name": "pippo"
  };

    this.http.post(this.BASE_URL_ROOM, body, {headers: this.headers}).subscribe({
      next: res => {
        this.charService.setRoom(res['data'].slug);
        this.getRoom(res['data'].slug);
      },
      error: err => console.log(err)
    });
  }

  destroyRoom() {
    this.charService.getRoom().then(res => {
      const dddice_RoomSlug = res;
      this.http.delete(this.BASE_URL_ROOM + dddice_RoomSlug, { headers: this.headers }).subscribe({
        next: res => {
          this.charService.destroyRoom()
        },
        error: err => console.log(err)
      })
    })
  }

  public getRoom(slugRoom: string){
    this.http.get(this.BASE_URL_ROOM + slugRoom, { headers: this.headers }).subscribe({
      next: res => console.log(res),
      error: err => console.log(err)
    })
  }
}
