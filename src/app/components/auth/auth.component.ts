import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuthProvider, getAuth, setPersistence, browserLocalPersistence, signInWithPopup } from 'firebase/auth';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {

  constructor(private router: Router) {}

  public loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    setPersistence(auth, browserLocalPersistence).then(() => {
      signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential!.accessToken;
        const user = result.user;

        if (user) {
          localStorage.setItem('dndCS-2023-logged', 'true');
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
      })
    })
  }
}
