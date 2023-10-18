import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthComponent } from './components/auth/auth.component';
import { FormComponent } from './components/form/form.component';
import { CharacterViewComponent } from './components/character-view/character-view.component';
import { AuthGuardService } from './services/auth-guard.service';
import { CharacterListComponent } from './components/character-list/character-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: AuthComponent },
  { path: 'create/:id', component: FormComponent, canActivate: [AuthGuardService] },
  { path: 'view/:id', component: CharacterViewComponent, canActivate: [AuthGuardService] },
  { path: 'characters', component: CharacterListComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
