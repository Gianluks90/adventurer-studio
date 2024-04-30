import { Injectable } from '@angular/core';
import { DddiceService } from './dddice.service';
import { NotificationService } from './notification.service';
import { ThreeDDiceRollEvent } from 'dddice-js';
import { CharacterService } from './character.service';

@Injectable({
  providedIn: 'root'
})
export class RollDiceService {

  // public diceTheme: string = "dddice-black";
  public diceTheme: string = "dddice-bees";

  constructor(private dddice: DddiceService, private notification: NotificationService, private charService: CharacterService) {
    this.charService.getRollTheme().then((theme) => {
      if (theme && theme != '') {
        this.diceTheme = theme;
      }
    });
  }

  public async testRoll(): Promise<any> {
    const DDDICE = this.dddice.dddice;
    if (DDDICE) {
      this.notification.openDiceSnackBar("Tiro...", "casino", 10000);
      DDDICE.roll(
        [{
          theme: this.diceTheme != '' ? this.diceTheme : 'dddice-black',
          type: "d20",
        }]
      ).then((result) => {
        DDDICE.on(ThreeDDiceRollEvent.RollFinished, () => {
          this.notification.dismissSnackBar();
          // this.notification.openDiceSnackBar("Ottenuto: " + result.data.total_value, "casino");
        });
      });
    }
  }

  public async rollDice(dices: string[], diceFormula: string, modifier?: number): Promise<any> {
    const DDDICE = this.dddice.dddice;
    if (DDDICE) {
      this.notification.openDiceSnackBar("Tiro...", "casino", 10000);
      DDDICE.roll(
        dices.map((dice) => {
          return {
            theme: this.diceTheme != '' ? this.diceTheme : 'dddice-black',
            type: dice,
          }
        })
      ).then((result) => {
        DDDICE.on(ThreeDDiceRollEvent.RollFinished, () => {
          this.notification.dismissSnackBar();
          const finalResult = Number(result.data.total_value) + modifier;
          this.notification.openDiceSnackBar("Ottenuto: " + diceFormula + " = " + finalResult, "casino");
        });
      });
    }
  }

  public async rollFromCharView(dice: string, message: string, modifier?: number, dadiVita?: boolean): Promise<any> {
    const DDDICE = this.dddice.dddice;
    if (DDDICE) {
      this.notification.openSnackBar("Tiro...", "casino");
      DDDICE.roll(
        [{
          theme: this.diceTheme != '' ? this.diceTheme : 'dddice-black',
          type: dice,
        }]
      ).then((result) => {
        DDDICE.on(ThreeDDiceRollEvent.RollFinished, () => {
          this.notification.dismissSnackBar();
          const finalResult = Number(result.data.total_value) + (modifier || 0);
          let diceFormula = '';
          if (modifier) {
            diceFormula = dice + (modifier > 0 ? ' + ' + modifier : modifier);
          } else {
            diceFormula = dice;
          }
          if (result.data.values[0].value == 20 && !dadiVita) {
            this.notification.openDiceSnackBar(message + " (" + diceFormula + "), ottenuto: 20, SUCCESSO CRITICO!", "casino", 5000);
            return;
          }
          if (result.data.values[0].value == 1 && !dadiVita) {
            this.notification.openDiceSnackBar(message + " (" + diceFormula + "), ottenuto: 1, FALLIMENTO CRITICO!", "casino", 5000);
            return;
          }
          this.notification.openDiceSnackBar(message + " (" + diceFormula + "), ottenuto: " + finalResult, "casino", 5000);
        });
      });
    }
  }

  public async rollD100(modifier?: number): Promise<any> {
    const DDDICE = this.dddice.dddice;
    if (DDDICE) {
      this.notification.openDiceSnackBar("Tiro...", "casino", 10000);
      DDDICE.roll(
        [{
          theme: this.diceTheme != '' ? this.diceTheme : 'dddice-black',
          type: "d10",
        }, {
          theme: this.diceTheme != '' ? this.diceTheme : 'dddice-black',
          type: "d10x",
        }]
      ).then((result) => {
        // this.notification.dismissSnackBar();
        DDDICE.on(ThreeDDiceRollEvent.RollFinished, () => {
          this.notification.dismissSnackBar();
          const message = (Number(result.data.total_value) + modifier);
          this.notification.openDiceSnackBar("Ottenuto: " + message, "casino");
        });
      });
    }
  }

  public async rollAdvantageDisadvantage(rollType: string, modifier?: number): Promise<any> {
    const DDDICE = this.dddice.dddice;
    if (DDDICE) {
      let message = rollType === "adv" ? "Tiro con vantaggio..." : "Tiro con svantaggio...";
      this.notification.openDiceSnackBar(message, "casino", 10000);
      DDDICE.roll(
        [{
          theme: this.diceTheme != '' ? this.diceTheme : 'dddice-black',
          type: "d20",
        },
        {
          theme: this.diceTheme != '' ? this.diceTheme : 'dddice-black',
          type: "d20",
        }
        ]).then((result) => {
          let rollResult = 0;
          let finalResult = 0;
          if (rollType === "adv") {
            rollResult = result.data.values[0].value > result.data.values[1].value ? result.data.values[0].value : result.data.values[1].value;
            finalResult = rollResult + modifier;
            DDDICE.on(ThreeDDiceRollEvent.RollFinished, () => {
              if (rollResult == 20) {
                this.notification.openSnackBar("Ottenuto: " + rollResult + ", SUCCESSO CRITICO!", "casino");
                return;
              }
              if (rollResult == 1) {
                this.notification.openSnackBar("Ottenuto: " + rollResult + ", FALLIMENTO CRITICO!", "casino");
                return;
              }
              if (modifier) {
                this.notification.openSnackBar("Ottenuto: " + rollResult + (modifier > 0 ? ' + ' + modifier : modifier) + " = " + finalResult, "casino");
              } else {
                this.notification.openSnackBar("Ottenuto: " + rollResult, "casino");
              }
              // this.notification.openSnackBar("Ottenuto: " + rollResult + (modifier > 0 ? ' + ' + modifier : '') + " = " + finalResult, "casino");
            });
          } else {
            rollResult = result.data.values[0].value < result.data.values[1].value ? result.data.values[0].value : result.data.values[1].value;
            finalResult = rollResult + modifier;
            DDDICE.on(ThreeDDiceRollEvent.RollFinished, () => {
              if (rollResult == 20) {
                this.notification.openSnackBar("Ottenuto: " + rollResult + ", SUCCESSO CRITICO!", "casino");
                return;
              }
              if (rollResult == 1) {
                this.notification.openSnackBar("Ottenuto: " + rollResult + ", FALLIMENTO CRITICO!", "casino");
                return;
              }
              if (modifier) {
                this.notification.openSnackBar("Ottenuto: " + rollResult + (modifier > 0 ? ' + ' + modifier : modifier) + " = " + finalResult, "casino");
              } else {
                this.notification.openSnackBar("Ottenuto: " + rollResult, "casino");
              }
              // this.notification.openSnackBar("Ottenuto: " + rollResult + (modifier > 0 ? ' + ' + modifier : '') + " = " + finalResult, "casino");
            });
          }
        });
    }
  }

  public async rollDamage(diceFormula: string): Promise<any> {
    const parsedFormula = this.parseDiceFormula(diceFormula);

    const dices = parsedFormula.diceArray;
    const modifier = parsedFormula.modifier;

    const DDDICE = this.dddice.dddice;
    if (DDDICE) {
      this.notification.openDiceSnackBar("Tiro...", "casino", 10000);
      DDDICE.roll(
        dices.map((dice) => {
          return {
            theme: this.diceTheme != '' ? this.diceTheme : 'dddice-black',
            type: dice,
          }
        })
      ).then((result) => {
        DDDICE.on(ThreeDDiceRollEvent.RollFinished, () => {
          this.notification.dismissSnackBar();
          if (modifier) {
            const finalResult = Number(result.data.total_value) + modifier;
            // this.notification.openDiceSnackBar("Ottenuto: " + diceFormula + " +  " + finalResult, "casino");
            this.notification.openDiceSnackBar("Ottenuto: " + result.data.total_value + (modifier > 0 ? " +" + modifier : " " + modifier) + " = " + finalResult, "casino")
          } else {
            const finalResult = result.data.total_value;
            this.notification.openDiceSnackBar("Ottenuto: " + finalResult, "casino");
          }
          // const finalResult = result.data.total_value
          // this.notification.openDiceSnackBar("Ottenuto: " + diceFormula + " = " + finalResult, "casino");
        });
      });
    }

  }
  public parseDiceFormula(formula: string): any {
    let modifier = 0;
    const diceArray = [];
    const parts = formula.split(/(?=[+-])/);
    for (const part of parts) {
      if (part.includes('d')) {
        const [numberOfDice, diceType] = part.split('d').map(Number);
        for (let i = 0; i < numberOfDice; i++) {
          diceArray.push(`d${diceType}`);
        }
      } else {
        modifier += parseInt(part) || 0;
      }
    }
    return { diceArray, modifier };
  }
}
