import { FormBuilder, Validators } from "@angular/forms";

export class FormModel {

  constructor() { }

  static create(builder: FormBuilder) {
    return {
      informazioniBase: FormModel.informazioniBase(builder),
      caratteristiche: FormModel.caratteristiche(builder),
      
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
      nomeGiocatore: ['', Validators.required],
      classe: ['', Validators.required],
      specializzazione: '',
      livello: [1, Validators.max(20)],
      background: ['', Validators.required],
      razza: ['', Validators.required],
      sottorazza: '',
      allineamento: ['', Validators.required],
      nomePersonaggio: ['', Validators.required]
    })
  }

  static caratteristiche(builder: FormBuilder) {
    return builder.group({
      forza: [0, [Validators.max(20), Validators.required]],
      destrezza: [0, [Validators.max(20), Validators.required]],
      costituzione: [0, [Validators.max(20), Validators.required]],
      intelligenza: [0, [Validators.max(20), Validators.required]],
      saggezza: [0, [Validators.max(20), Validators.required]],
      carisma: [0, [Validators.max(20), Validators.required]]
    })
  }

  static tiriSalvezza(builder: FormBuilder) {
    return builder.group({
      bonusCompetenza: [2, Validators.max(6)],
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
      storia:false,

      maestriaAcrobazia: false,
      maestriaAddestrareAnimali: false,
      maestriaArcano: false,
      maestriaAtletica: false,
      maestriaFurtivita: false,
      maestriaIndagare: false,
      maestriaInganno: false,
      maestriaIntimidire: false,
      maestriaIntuizione: false,
      maestriaIntrattenere: false,
      maestriaInvestigare: false,
      maestriaMedicina: false,
      maestriaNatura: false,
      maestriaPercezione: false,
      maestriaPersuasione: false,
      maestriaRapiditaDiMano: false,
      maestriaReligione: false,
      maestriaSopravvivenza: false,
      maestriaStoria: false,

    })
  }

  static puntiFerita(builder: FormBuilder) {
    return builder.group({
      massimoPuntiFerita: [0, [Validators.min(1), Validators.required]],
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
