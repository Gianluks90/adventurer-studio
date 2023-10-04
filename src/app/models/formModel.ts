import { FormBuilder, Validators } from "@angular/forms";

export class FormModel {

  constructor() { }

  static create(builder: FormBuilder) {
    return {
      informazioniBase: FormModel.informazioniBase(builder),
      caratteristiche: FormModel.caratteristiche(builder),
      bonusCompetenza: 2,
      tiriSalvezza: FormModel.tiriSalvezza(builder),
      competenzaAbilita: FormModel.competenzaAbilita(builder),
      CA: 0,
      iniziativa: 0,
      velocita: 0,
      puntiFerita: FormModel.puntiFerita(builder),
      trattiBackground: FormModel.trattiBackground(builder),
      altreCompetenze: FormModel.altreCompetenze(builder),
      denaro: FormModel.denaro(builder),
      equipaggiamento: [''],
      privilegiTratti: [''],
      attacchiIncantesimi: FormModel.attacchiIncantesimi(builder),
      caratteristicheFisiche: FormModel.caratteristicheFisiche(builder),
      urlImmaginePersonaggio: '',
      urlImmagineSimbolo: '',
      alleatiOrganizzazioni: [''],
      storiaPersonaggio: '',
      trattiPrivilegiAggiuntivi: [''],
      tesoro: [''],
      classeIncantatore: '',
      caratteristicaIncantatore: '',
      CDTiroSalvezza: 0,
      bonusAttaccoIncantesimi: 0,
      // Trucchetti e Incantesimi da vedere come fare
    }
  }

  static informazioniBase(builder: FormBuilder) {
    return builder.group({
      nomeGiocatore:'',
      classe: '',
      livello: [1, Validators.max(20)],
      background: '',
      razza: '',
      allineamento: '',
      nomePersonaggio:''
    })
  }

  static caratteristiche(builder: FormBuilder) {
    return builder.group({
      forza: [0, Validators.max(20)],
      destrezza: [0, Validators.max(20)],
      costituzione: [0, Validators.max(20)],
      intelligenza: [0, Validators.max(20)],
      saggezza: [0, Validators.max(20)],
      carisma: [0, Validators.max(20)]
    })
  }

  static tiriSalvezza(builder: FormBuilder) {
    return builder.group({
      forza: false,
      destrezza: false,
      costituzione: false,
      intelligenza: false,
      saggezza: false,
      carisma: false
    })
  }

  static competenzaAbilita(builder: FormBuilder) { // TODO - Controllare elenco (l'ho lasciato scrivere a copilot)
    return builder.group({
      acrobazia: false,
      addestrareAnimali: false,
      arcano: false,
      atletica: false,
      furtivita: false,
      indagare: false,
      inganno: false,
      intuizione: false,
      intimidire: false,
      intrattenere: false,
      investigare: false,
      medicina: false,
      natura: false,
      percezione: false,
      persuasione: false,
      rapiditaDiMano: false,
      religione: false,
      sopravvivenza: false,
      storia:false
    })
  }

  static puntiFerita(builder: FormBuilder) {
    return builder.group({
      massimoPuntiFerita: 0,
      puntiFeritaAttuali: 0,
      puntiFeritaTemporanei: 0,
      totaleDadiVita:0,
      dadiVita: ''
    })
  }

  static trattiBackground(builder: FormBuilder) {
    return builder.group({
      trattiCaratteriali: '',
      ideali: '',
      legami: '',
      difetti: '',
    })
  }

  static altreCompetenze(builder: FormBuilder) {
    return builder.group({
      linguaggi: [''],
      armi: [''],
      armature: [''],
      strumenti: [''],
      altro: ['']
    })
  }

  static denaro(builder: FormBuilder) {
    return builder.group({
      MR: 0,
      MA: 0,
      ME: 0,
      MO: 0,
      MP: 0
    })
  }

  static attacchiIncantesimi(builder: FormBuilder) {
    return builder.group({
      // Qui mi sa che ci vuole un formArray perchè ogni attacco ha un nome, un bonus e un danno e cose così
    })
  }

  static caratteristicheFisiche(builder: FormBuilder) {
    return builder.group({
      eta: 0,
      altezza: 0,
      peso: 0,
      occhi: '',
      carnagione: '',
      capelli: '',
    })
  }
}
