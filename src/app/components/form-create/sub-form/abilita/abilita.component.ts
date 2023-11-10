import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-abilita',
  templateUrl: './abilita.component.html',
  styleUrls: ['./abilita.component.scss']
})
export class AbilitaComponent {

  public group: FormGroup | null = null;
  public caratteristiche: FormGroup | null = null;
  public bonusCompetenza: number = 0;

  public modForza: number = 0;
  public modDestrezza: number = 0;
  public modCostituzione: number = 0;
  public modIntelligenza: number = 0;
  public modSaggezza: number = 0;
  public modCarisma: number = 0;

  public tiroAcrobazia: number = 0;
  public tiroAddestrareAnimali: number = 0;
  public tiroArcano: number = 0;
  public tiroAtletica: number = 0;
  public tiroFurtivita: number = 0;
  public tiroIndagare: number = 0;
  public tiroInganno: number = 0;
  public tiroIntimidire: number = 0;
  public tiroIntrattenere: number = 0;
  public tiroIntuizione: number = 0;
  public tiroMedicina: number = 0;
  public tiroNatura: number = 0;
  public tiroPercezione: number = 0;
  public tiroPersuasione: number = 0;
  public tiroRapiditaMano: number = 0;
  public tiroReligione: number = 0;
  public tiroSopravvivenza: number = 0;
  public tiroStoria: number = 0;

  constructor(public formService: FormService) {}

  ngOnInit(): void {

    this.formService.formSubject.subscribe((form: any) => {
      if (form) {
        this.bonusCompetenza = form.get('tiriSalvezza')?.get('bonusCompetenza').value;
        this.caratteristiche = form.get('caratteristiche') as FormGroup;
        this.applyModifier();
        this.group = form.get('competenzaAbilita') as FormGroup;
        this.applyBonusCompetenza();
      }
    });
  }

  public applyModifier(): void {
    this.modForza = Math.floor((this.caratteristiche?.get('forza')?.value - 10) / 2);
    this.modDestrezza = Math.floor((this.caratteristiche?.get('destrezza')?.value - 10) / 2);
    this.modCostituzione = Math.floor((this.caratteristiche?.get('costituzione')?.value - 10) / 2);
    this.modIntelligenza = Math.floor((this.caratteristiche?.get('intelligenza')?.value - 10) / 2);
    this.modSaggezza = Math.floor((this.caratteristiche?.get('saggezza')?.value - 10) / 2);
    this.modCarisma = Math.floor((this.caratteristiche?.get('carisma')?.value - 10) / 2);
  }

  public applyBonusCompetenza(): void {
    this.tiroAcrobazia = this.group?.get('acrobazia')?.value ? this.modDestrezza + (this.group?.get('maestriaAcrobazia')?.value ? this.bonusCompetenza *2 : this.bonusCompetenza) : this.modDestrezza;
    this.tiroAddestrareAnimali = this.group?.get('addestrareAnimali')?.value ? this.modSaggezza + (this.group?.get('maestriaAddestrareAnimali')?.value ? this.bonusCompetenza *2 : this.bonusCompetenza) : this.modSaggezza;
    this.tiroArcano = this.group?.get('arcano')?.value ? this.modIntelligenza + (this.group?.get('maestriaArcano')?.value ? this.bonusCompetenza *2 : this.bonusCompetenza) : this.modIntelligenza;
    this.tiroAtletica = this.group?.get('atletica')?.value ? this.modForza + (this.group?.get('maestriaAtletica')?.value ? this.bonusCompetenza *2 : this.bonusCompetenza) : this.modForza;
    this.tiroFurtivita = this.group?.get('furtivita')?.value ? this.modDestrezza + (this.group?.get('maestriaFurtivita')?.value ? this.bonusCompetenza *2 : this.bonusCompetenza) : this.modDestrezza;
    this.tiroIndagare = this.group?.get('indagare')?.value ? this.modIntelligenza + (this.group?.get('maestriaIndagare')?.value ? this.bonusCompetenza *2 : this.bonusCompetenza) : this.modIntelligenza;
    this.tiroInganno = this.group?.get('inganno')?.value ? this.modCarisma + (this.group?.get('maestriaInganno')?.value ? this.bonusCompetenza *2 : this.bonusCompetenza) : this.modCarisma;
    this.tiroIntimidire = this.group?.get('intimidire')?.value ? this.modCarisma + (this.group?.get('maestriaIntimidire')?.value ? this.bonusCompetenza *2 : this.bonusCompetenza) : this.modCarisma;
    this.tiroIntrattenere = this.group?.get('intrattenere')?.value ? this.modCarisma + (this.group?.get('maestriaIntrattenere')?.value ? this.bonusCompetenza *2 : this.bonusCompetenza) : this.modCarisma;
    this.tiroIntuizione = this.group?.get('intuizione')?.value ? this.modSaggezza + (this.group?.get('maestriaIntuizione')?.value ? this.bonusCompetenza *2 : this.bonusCompetenza) : this.modSaggezza;
    this.tiroMedicina = this.group?.get('medicina')?.value ? this.modSaggezza + (this.group?.get('maestriaMedicina')?.value ? this.bonusCompetenza *2 : this.bonusCompetenza) : this.modSaggezza;
    this.tiroNatura = this.group?.get('natura')?.value ? this.modIntelligenza + (this.group?.get('maestriaNatura')?.value ? this.bonusCompetenza *2 : this.bonusCompetenza) : this.modIntelligenza;
    this.tiroPercezione = this.group?.get('percezione')?.value ? this.modSaggezza + (this.group?.get('maestriaPercezione')?.value ? this.bonusCompetenza *2 : this.bonusCompetenza) : this.modSaggezza;
    this.tiroPersuasione = this.group?.get('persuasione')?.value ? this.modCarisma + (this.group?.get('maestriaPersuasione')?.value ? this.bonusCompetenza *2 : this.bonusCompetenza) : this.modCarisma;
    this.tiroRapiditaMano = this.group?.get('rapiditaDiMano')?.value ? this.modDestrezza + (this.group?.get('maestriaRapiditaDiMano')?.value ? this.bonusCompetenza *2 : this.bonusCompetenza) : this.modDestrezza;
    this.tiroReligione = this.group?.get('religione')?.value ? this.modIntelligenza + (this.group?.get('maestriaReligione')?.value ? this.bonusCompetenza *2 : this.bonusCompetenza) : this.modIntelligenza;
    this.tiroSopravvivenza = this.group?.get('sopravvivenza')?.value ? this.modSaggezza + (this.group?.get('maestriaSopravvivenza')?.value ? this.bonusCompetenza *2 : this.bonusCompetenza) : this.modSaggezza;
    this.tiroStoria = this.group?.get('storia')?.value ? this.modIntelligenza + (this.group?.get('maestriaStoria')?.value ? this.bonusCompetenza *2 : this.bonusCompetenza) : this.modIntelligenza;
  }

  public updateAbilita() {
    this.applyModifier();
    this.applyBonusCompetenza();
  }
}
