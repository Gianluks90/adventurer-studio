import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthComponent } from "./components/auth/auth.component";
import { CharacterListComponent } from "./components/character-list/character-list.component";
import { DeleteCharacterDialogComponent } from "./components/character-list/delete-character-dialog/delete-character-dialog.component";
import { CharacterViewComponent } from "./components/character-view/character-view.component";
import { CompleteCharacterDialogComponent } from "./components/form-create/complete-character-dialog/complete-character-dialog.component";
import { FormCreateComponent } from "./components/form-create/form-create.component";
import { AbilitaComponent } from "./components/form-create/sub-form/abilita/abilita.component";
import { BackgroundComponent } from "./components/form-create/sub-form/background/background.component";
import { InformazioniBaseComponent } from "./components/form-create/sub-form/basic-information/informazioni-base.component";
import { CaratteristicheComponent } from "./components/form-create/sub-form/caratteristiche/caratteristiche.component";
import { EquipaggiamentoComponent } from "./components/form-create/sub-form/equipaggiamento/equipaggiamento.component";
import { LinguaggiCompetenzeComponent } from "./components/form-create/sub-form/linguaggi-competenze/linguaggi-competenze.component";
import { ParametriVitaliComponent } from "./components/form-create/sub-form/parametri-vitali/parametri-vitali.component";
import { PrivilegiTrattiComponent } from "./components/form-create/sub-form/privilegi-tratti/privilegi-tratti.component";
import { StoriaComponent } from "./components/form-create/sub-form/storia/storia.component";
import { TiriSalvezzaComponent } from "./components/form-create/sub-form/tiri-salvezza/tiri-salvezza.component";
import { TrucchettiIncantesimiComponent } from "./components/form-create/sub-form/trucchetti-incantesimi/trucchetti-incantesimi.component";
import { FormLevelUpComponent } from "./components/form-level-up/form-level-up.component";
import { HomeComponent } from "./components/home/home.component";
import { MoneteComponent } from "./components/monete/monete.component";
import { AddCharacterDialogComponent } from "./components/character-list/add-character-dialog/add-character-dialog.component";
import { SidenavComponent } from "./components/sidenav/sidenav.component";
import { SnackbarComponent } from "./components/utilities/snackbar/snackbar.component";
import { SharedModule } from "./modules/shared/shared.module";
import { SidenavService } from "./services/sidenav.service";
import { CompleteLevelUpDialogComponent } from './components/form-level-up/complete-level-up-dialog/complete-level-up-dialog.component';
import { InformazioniBaseLevelUpComponent } from './components/form-level-up/sub-components/informazioni-base-level-up/informazioni-base-level-up.component';
import { CaratteristicheLevelUpComponent } from './components/form-level-up/sub-components/caratteristiche-level-up/caratteristiche-level-up.component';
import { TiriSalvezzaLevelUpComponent } from './components/form-level-up/sub-components/tiri-salvezza-level-up/tiri-salvezza-level-up.component';
import { CompetenzeAbilitaLevelUpComponent } from './components/form-level-up/sub-components/competenze-abilita-level-up/competenze-abilita-level-up.component';
import { ParametriVitaliLevelUpComponent } from './components/form-level-up/sub-components/parametri-vitali-level-up/parametri-vitali-level-up.component';
import { CompetenzeLinguaggiLevelUpComponent } from './components/form-level-up/sub-components/competenze-linguaggi-level-up/competenze-linguaggi-level-up.component';
import { PrivilegiTrattiLevelUpComponent } from './components/form-level-up/sub-components/privilegi-tratti-level-up/privilegi-tratti-level-up.component';
import { TrucchettiIncantesimiLevelUpComponent } from './components/form-level-up/sub-components/trucchetti-incantesimi-level-up/trucchetti-incantesimi-level-up.component';
import { DiceComponent } from './components/dice/dice.component';
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [
    // MAIN COMPONENTS
    AppComponent,
    HomeComponent,
    AuthComponent,

    // VIEWS COMPONENTS
    CharacterViewComponent,
    SidenavComponent,

    // DIALOG COMPONENTS
    DeleteCharacterDialogComponent,
    CompleteCharacterDialogComponent,
    AddCharacterDialogComponent,
    CharacterListComponent,
    CompleteLevelUpDialogComponent,

    // UTILITIES COMPONENTS
    MoneteComponent,
    SnackbarComponent,

    // FORM CREATE COMPONENTS AND SUB-COMPONENTS
    FormCreateComponent,
    // sub-components
    InformazioniBaseComponent,
    AbilitaComponent,
    CaratteristicheComponent,
    EquipaggiamentoComponent,
    LinguaggiCompetenzeComponent,
    ParametriVitaliComponent,
    PrivilegiTrattiComponent,
    TiriSalvezzaComponent,
    BackgroundComponent,
    StoriaComponent,
    TrucchettiIncantesimiComponent,

    // FORM LEVEL UP COMPONENTS AND SUB-COMPONENTS
    FormLevelUpComponent,
    // sub-components
     InformazioniBaseLevelUpComponent,
     CaratteristicheLevelUpComponent,
     TiriSalvezzaLevelUpComponent,
     CompetenzeAbilitaLevelUpComponent,
     ParametriVitaliLevelUpComponent,
     CompetenzeLinguaggiLevelUpComponent,
     PrivilegiTrattiLevelUpComponent,
     TrucchettiIncantesimiLevelUpComponent,
     DiceComponent,

  ],
  imports: [
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [SidenavService],
  bootstrap: [AppComponent]
})
export class AppModule { }
