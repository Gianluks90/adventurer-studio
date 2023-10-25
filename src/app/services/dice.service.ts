import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiceService {
  private BASE_URL = "https://dddice.com/api/1.0/roll";
  private headers = {
    "Authorization": "Bearer xWudPBDUPShExHODFj3LpVTfHnpq5sNYmz5Cq88s851a8216",
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
  public result: BehaviorSubject<number> = new BehaviorSubject(null);

  constructor(private http: HttpClient) { }

  public async getRoll(body: any){
    this.http.post(this.BASE_URL, body, {headers: this.headers}).subscribe({
      next: (res:any) => {
        if(res){
          this.result.next(res.data.total_value);
        }
      },
      error: err => console.log(err)
    });
  }
}
