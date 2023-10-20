import { FormArray, FormBuilder, Validators } from "@angular/forms";

export class FormModel {

  constructor() { }

  static create(builder: FormBuilder) {
    return {
      informazioniBase: FormModel.informazioniBase(builder),
      caratteristiche: FormModel.caratteristiche(builder),
      tiriSalvezza: FormModel.tiriSalvezza(builder),
      competenzaAbilita: FormModel.competenzaAbilita(builder),
      CA: [0, Validators.required],
      iniziativa: [0, Validators.required],
      velocita: [0, Validators.required],
      parametriVitali: FormModel.parametriVitali(builder),
      trattiBackground: FormModel.trattiBackground(builder),
      altreCompetenze: FormModel.altreCompetenze(builder),
      denaro: FormModel.denaro(builder),
      equipaggiamento: ['', Validators.required],
      privilegiTratti: builder.array([]),
      trucchettiIncantesimi: builder.array([]),
      caratteristicheFisiche: FormModel.caratteristicheFisiche(builder),
      urlImmaginePersonaggio: '',
      urlImmagineSimbolo: '',
      alleatiOrganizzazioni: '',
      storiaPersonaggio: '',
      trattiPrivilegiAggiuntivi: '',
      tesoro: '',
      classeIncantatore: '',
      caratteristicaIncantatore: '',
      CDTiroSalvezza: 0,
      bonusAttaccoIncantesimi: 0,
      status: {
        statusCode: null,
        author: '',
        creationDate: null,
        lastUpadateDate: null,
        userId: '',
      }
    }
  }

  static informazioniBase(builder: FormBuilder) {
    return builder.group({
      nomeGiocatore: ['', Validators.required],
      classi: builder.array([]),
      classe: ['', Validators.required],
      sottoclasse: '',
      livello: [1, Validators.max(20)],
      background: ['', Validators.required],
      razza: ['', Validators.required],
      sottorazza: '',
      allineamento: ['', Validators.required],
      nomePersonaggio: ['', Validators.required],
      urlImmaginePersonaggio: '',
      nomeImmaginePersonaggio: '',
    })
  }

  static caratteristiche(builder: FormBuilder) {
    return builder.group({
      forza: [10, [Validators.max(20), Validators.required]],
      destrezza: [10, [Validators.max(20), Validators.required]],
      costituzione: [10, [Validators.max(20), Validators.required]],
      intelligenza: [10, [Validators.max(20), Validators.required]],
      saggezza: [10, [Validators.max(20), Validators.required]],
      carisma: [10, [Validators.max(20), Validators.required]]
    })
  }

  static tiriSalvezza(builder: FormBuilder) {
    return builder.group({
      bonusCompetenza: [2, [Validators.max(6), Validators.required]],
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

  static parametriVitali(builder: FormBuilder) {
    return builder.group({
      massimoPuntiFerita: [0, [Validators.min(1), Validators.required]],
      puntiFeritaAttuali: 0,
      puntiFeritaTemporanei: 0,
      // totaleDadiVita: [0, [Validators.min(1), Validators.required]],
      // dadiVitaOld: ['', Validators.required],
      dadiVita: [[], Validators.required],
    })
  }

  static trattiBackground(builder: FormBuilder) {
    return builder.group({
      trattiCaratteriali: ['', Validators.required],
      ideali: ['', Validators.required],
      legami: ['', Validators.required],
      difetti: ['', Validators.required]
    })
  }

  static altreCompetenze(builder: FormBuilder) {
    return builder.group({
      linguaggi: [[], Validators.required],
      armi: [[], Validators.required],
      armature: [[], Validators.required],
      strumenti: [[], Validators.required],
      altro: []
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
