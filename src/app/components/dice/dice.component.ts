import { Component } from '@angular/core';
import { DiceService } from 'src/app/services/dice.service';
import { ThreeDDice } from 'dddice-js';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.scss']
})
export class DiceComponent {
  private dddice: any
  // private idStanza: string = "VlClkLL" // DEVE ESSERE FORNITO DALL'UTENTE (POSSIBILE AGGIUNTA DI PASSWORD AL MOMENTO DELLA CONNESSIONE)
  private idStanza: string = "";
  public totale: number = 0;
  public arrayDadiSalvati: string[] = [];
  public dadi = [
    {
      nome: "./assets/images/4-dice.png",
      valore: "d4",
      selezionati: 0
    },
    {
      nome: "D6",
      valore: "d6",
      selezionati: 0
    },
    {
      nome: "D8",
      valore: "d8",
      selezionati: 0
    },
    {
      nome: "D12",
      valore: "d12",
      selezionati: 0
    },
    {
      nome: "./assets/images/20-dice.svg",
      valore: "d20",
      selezionati: 0
    }
  ]
  public isMenuOpen = false;

  constructor(private service: DiceService) {
    this.service.result.subscribe({
      next: res => {
        if(res){
          console.log(res)
          this.totale = res
        }
      },
      error: err => console.log(err)
    })
    this.idStanza = getAuth().currentUser!.uid.slice(0,5);
  }

  ngOnInit() {
    this.initRollTable();
  }

  // FUNZIONE CHE INIZIALIZZA E CONNETTE AL TAVOLO DI GIOCO
  private initRollTable() {
    let element = (document.getElementById("dddice") as HTMLCanvasElement);
    this.dddice = new ThreeDDice(element, "xWudPBDUPShExHODFj3LpVTfHnpq5sNYmz5Cq88s851a8216");
    this.dddice.start();
    this.dddice.connect(this.idStanza);
  }

  // FUNZIONE CHE CREA IL BODY PER LA CHIAMATA DEL TIRO
  public rollDice() {
    let mainBody = {
      "dice": [],
      "room": this.idStanza,
    };
    if (this.arrayDadiSalvati.length > 0) {
      for (const dado of this.arrayDadiSalvati) {
        let body = {
          "type": dado,
          "theme": "dddice-blue"
        }
        mainBody.dice.push(body);
        for (const dado of this.dadi) {
          dado.selezionati = 0;
        }
      }
      this.dddice.clear();
      this.totale = 0;
      this.callForRoll(mainBody);
    }
  }

  //FUNZIONE CHE CHIAMA IL SERVICE PER EFFETTUARE IL TIRO
  private callForRoll(dice: any) {
    this.service.getRoll(dice);
    setTimeout(() => this.totale = 0, 10000);
    this.arrayDadiSalvati = [];
  }

  // FUNZIONE CHE SALVA I VALORI DEI DADI NELL'ARRAY E LA QUANTITA' ALL'INTERNO DELL'OGGETTO
  public salvaDadi(valoreDadi: any) {
    for (const dado of this.dadi) {
      if (dado.valore === valoreDadi) {
        dado.selezionati += 1;
      }
    }
    this.arrayDadiSalvati.push(valoreDadi);
  }
}
