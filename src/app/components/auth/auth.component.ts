import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { doc, getDoc } from '@firebase/firestore';
import { GoogleAuthProvider, getAuth, setPersistence, browserLocalPersistence, signInWithPopup } from 'firebase/auth';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {

  constructor(private router: Router, private authGuardService: AuthGuardService, private firebaseService: FirebaseService) {}

  public loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    setPersistence(auth, browserLocalPersistence).then(() => {
      signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential!.accessToken;
        const user = result.user;
        
        this.checkUser(user.uid).then((doc) => {

        }).catch((error) => {

        });

        if (user) {
          localStorage.setItem('dndCS-2023-logged', 'true');
          this.authGuardService.logStatus(true);
          //const loginResult = await this.firebaseService.checkUser(user);
          // if (loginResult) {
            this.router.navigate(['/home']);
          //}
        }
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        localStorage.setItem('dndCS-2023-logged', 'false');
        this.authGuardService.logStatus(false);
      })
    })
  }

  private async checkUser(uid: string): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'users', uid);
    return await getDoc(docRef);
  }
}
