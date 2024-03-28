import { FormBuilder, Validators } from "@angular/forms";

export class Spell {
    tipologia: string;
    nome: string;
    scuola: string;
    scuolaPersonalizzata: string;
    livello: number;
    tempoLancio: string;
    gittata: string;
    componenti: string;
    formula?: string;
    durata: string;
    descrizione: string;
    livelloSuperiore?: string;
    riferimento?: string;
    preparato: boolean;
    icon: string;
    filtered: boolean;

    constructor(tipologia: string, nome: string, scuola: string, scuolaPersonalizzata: string, livello: number, tempoLancio: string, gittata: string, componenti: string, formula: string, durata: string, descrizione: string, livelloSuperiore: string, riferimento: string, preparato: boolean, icon: string, filtered: boolean) {
        this.tipologia = tipologia;
        this.nome = nome;
        this.scuola = scuola;
        this.scuolaPersonalizzata = scuolaPersonalizzata;
        this.livello = livello;
        this.tempoLancio = tempoLancio;
        this.gittata = gittata;
        this.componenti = componenti;
        this.formula = formula;
        this.durata = durata;
        this.descrizione = descrizione;
        this.livelloSuperiore = livelloSuperiore;
        this.riferimento = riferimento;
        this.preparato = preparato;
        this.icon = icon;
        this.filtered = filtered;
    }

    static create(builder: FormBuilder) {
        return {
            tipologia: ['trucchetto', Validators.required],
            nome: ['', Validators.required],
            scuola: ['', Validators.required],
            scuolaPersonalizzata: '',
            livello: [0, [Validators.required, Validators.min(0), Validators.max(9)]],
            tempoLancio: ['', Validators.required],
            gittata: ['', Validators.required],
            componenti: ['', Validators.required],
            formula: '',
            durata: ['', Validators.required],
            descrizione: ['', Validators.required],
            livelloSuperiore: '',
            riferimento: '',
            preparato: false,
            icon: '',
            filtered: false,
        }
    }
}