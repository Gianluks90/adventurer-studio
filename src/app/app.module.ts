import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AuthComponent } from './components/auth/auth.component';
import { FormComponent } from './components/form/form.component';
import { ViewComponent } from './components/view/view.component';
import { HeaderComponent } from './components/header/header.component';
import { BasicInformationComponent } from './components/form/sub-form/basic-information/basic-information.component';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';

import { AddCharacterDialogComponent } from './components/home/add-character-dialog/add-character-dialog.component';
import { CaratteristicheComponent } from './components/form/sub-form/caratteristiche/caratteristiche.component';
import { TiriSalvezzaComponent } from './components/form/sub-form/tiri-salvezza/tiri-salvezza.component';
import { AbilitaComponent } from './components/form/sub-form/abilita/abilita.component';
import { ParametriVitaliComponent } from './components/form/sub-form/parametri-vitali/parametri-vitali.component';
import { LinguaggiCompetenzeComponent } from './components/form/sub-form/linguaggi-competenze/linguaggi-competenze.component';
import { EquipaggiamentoComponent } from './components/form/sub-form/equipaggiamento/equipaggiamento.component';
import { PrivilegiTrattiComponent } from './components/form/sub-form/privilegi-tratti/privilegi-tratti.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthComponent,
    FormComponent,
    ViewComponent,
    HeaderComponent,
    BasicInformationComponent,
    AddCharacterDialogComponent,
    CaratteristicheComponent,
    TiriSalvezzaComponent,
    AbilitaComponent,
    ParametriVitaliComponent,
    LinguaggiCompetenzeComponent,
    EquipaggiamentoComponent,
    PrivilegiTrattiComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatMenuModule,
    MatDialogModule,
    MatCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
