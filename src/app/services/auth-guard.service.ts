import { EventEmitter, Injectable, Output } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  @Output() emitterlogStatus = new EventEmitter;

  constructor(private router: Router) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      getAuth().onAuthStateChanged(user => {
        if (user) {
          resolve(true);
        } else {
          this.router.navigate(['/login']);
          resolve(false);
        }
      })
    })
  }

  public logStatus(status:boolean){
   return this.emitterlogStatus.emit(status);
  }
}
