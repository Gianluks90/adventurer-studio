import { FormBuilder, Validators } from "@angular/forms";

export class FormLevelUpModel {

  constructor() { }

  static create(builder: FormBuilder) {
    return {
      informazioniBase: FormLevelUpModel.informazioniBase(builder),
      caratteristiche: FormLevelUpModel.caratteristiche(builder),
      tiriSalvezza: FormLevelUpModel.tiriSalvezza(builder),
      competenzaAbilita: FormLevelUpModel.competenzaAbilita(builder),
      CA: [0, Validators.required],
      iniziativa: [0, Validators.required],
      velocita: [0, Validators.required],
      parametriVitali: FormLevelUpModel.parametriVitali(builder),
      altreCompetenze: FormLevelUpModel.altreCompetenze(builder),
      privilegiTratti: builder.array([]),
      trucchettiIncantesimi: builder.array([]),
      classeIncantatore: '',
      caratteristicaIncantatore: '',
      CDTiroSalvezza: 0,
      bonusAttaccoIncantesimi: 0,
      slotIncantesimi: builder.array([]),
      incantesimiPreparabili: 0,
      status: {
        statusCode: null,
        author: '',
        creationDate: null,
        lastUpdateDate: null,
        userId: '',
      }
    }
  }

  static informazioniBase(builder: FormBuilder) {
    return builder.group({
      classi: builder.array([]),
      risorseAggiuntive: builder.array([]),
      livello: [1, Validators.max(20)],
      nomePersonaggio: ['', Validators.required]
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
      dadiVita: builder.array([])
    })
  }

  static altreCompetenze(builder: FormBuilder) {
    return builder.group({
      linguaggi: [],
      armi: [],
      armature: [],
      strumenti: [],
      altro: []
    })
  }
}
