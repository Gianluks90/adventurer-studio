// import { EventEmitter, Injectable, Output } from '@angular/core';
// import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
// import { getAuth } from 'firebase/auth';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuardService {
//   constructor(private router: Router) {}

//   public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
//     return new Promise((resolve, reject) => {
//       // console.log('auth');

//       getAuth().onAuthStateChanged(user => {
//         // console.log('user', user);
//         if (user) {
//           resolve(true);
//         } else {
//           this.router.navigate(['/login']);
//           resolve(false);
//         }
//       })
//     })
//   }

// }

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(private router: Router) { }

  public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    // console.log('auth');
    
    const auth = getAuth();
    const user = await this.getCurrentUser(auth);
    if (user) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  private getCurrentUser(auth: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged((user: any) => {
        unsubscribe(); // Unsubscribe immediately to avoid memory leaks
        resolve(user);
      }, reject);
    });
  }
}
