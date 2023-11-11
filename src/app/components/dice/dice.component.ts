import { Component } from '@angular/core';
import { DiceService } from 'src/app/services/dice.service';
import { DiceEvent, ThreeDDice, ThreeDDiceRollEvent } from 'dddice-js';
import { getAuth } from 'firebase/auth';
import { NotificationService } from 'src/app/services/notification.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.scss']
})
export class DiceComponent {
  private dddice: ThreeDDice;
  private idStanza: string = "" // DEVE ESSERE FORNITO DALL'UTENTE (POSSIBILE AGGIUNTA DI PASSWORD AL MOMENTO DELLA CONNESSIONE)
  // private idStanza: string = "";
  public totale: number = 0;
  public arrayDadiSalvati: string[] = [];
  public dadi = [
    {
      nome: "./assets/dice/dice-d4.svg",
      valore: "d4",
      selezionati: 0
    },
    {
      nome: "./assets/dice/dice-d6.svg",
      valore: "d6",
      selezionati: 0
    },
    {
      nome: "./assets/dice/dice-d8.svg",
      valore: "d8",
      selezionati: 0
    },
    {
      nome: "./assets/dice/dice-d10.svg",
      valore: "d10",
      selezionati: 0
    },
    {
      nome: "./assets/dice/dice-d12.svg",
      valore: "d12",
      selezionati: 0
    },
    {
      nome: "./assets/dice/dice-d20.svg",
      valore: "d20",
      selezionati: 0
    }
  ]
  public isMenuOpen = false;

  constructor(private service: DiceService, private notification: NotificationService, private firebaseService: FirebaseService) {
    this.service.result.subscribe({
      next: res => {
        if(res){
          this.totale = res
          this.notification.openSnackBar( 'Il risultato del tiro è ' + res.toString(),'check', 5000, 'limegreen');
        }
      },
      error: err => console.log(err)
    });
    this.firebaseService.getUser(getAuth().currentUser).then(res => {this.idStanza = res.data()["dddice_RoomSlug"]; this.initRollTable()})
  }

  ngOnInit() {
    // if(this.idStanza){
    //   this.initRollTable();
    // }
  }

  // FUNZIONE CHE INIZIALIZZA E CONNETTE AL TAVOLO DI GIOCO
  private initRollTable() {
    let element = (document.getElementById("dddice") as HTMLCanvasElement);
    this.dddice = new ThreeDDice(element, "CQSIqORUGw8et99lyxShEdYLWvyq4rmzATYTyftR1ced18ab");
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
    if (this.arrayDadiSalvati.length < 25) {
      for (const dado of this.dadi) {
      if (dado.valore === valoreDadi) {
        dado.selezionati += 1;
      }
    }
      this.arrayDadiSalvati.push(valoreDadi);
    } else {
      this.notification.openSnackBar( 'hai raggiunto il limite dei dadi selezionabili','warning', 3000,'red');
    }

  }
}
