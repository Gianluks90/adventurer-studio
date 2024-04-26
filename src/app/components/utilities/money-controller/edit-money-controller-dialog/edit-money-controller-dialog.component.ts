import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-edit-money-controller-dialog',
  templateUrl: './edit-money-controller-dialog.component.html',
  styleUrl: './edit-money-controller-dialog.component.scss'
})
export class EditMoneyControllerDialogComponent {
  public form: FormGroup;
  public convertForm: FormGroup;
  private maxWalletValue: number = 0;

  public moneyTypes: any[] = [
    {
      label: 'Rame',
      value: 'MR'
    },
    {
      label: 'Argento',
      value: 'MA'
    },
    {
      label: 'Electrum',
      value: 'ME'
    },
    {
      label: 'Oro',
      value: 'MO'
    },
    {
      label: 'Platino',
      value: 'MP'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditMoneyControllerDialogComponent>,
    private charService: CharacterService,
    @Inject(MAT_DIALOG_DATA) public data: { charId: string, denaro: any }) {
    this.form = this.fb.group({
      MP: [0, Validators.min(0)],
      MO: [0, Validators.min(0)],
      ME: [0, Validators.min(0)],
      MA: [0, Validators.min(0)],
      MR: [0, Validators.min(0)],
      advancedForm: false,
    });
    this.convertForm = this.fb.group({
      from: [null, Validators.required],
      to: [null, Validators.required]
    });
  }

  public resetForm(): void {
    this.form.patchValue({
      MP: 0,
      MO: 0,
      ME: 0,
      MA: 0,
      MR: 0
    });
  }

  public addMoney(): void {
    this.data.denaro.MP += this.form.get('MP').value;
    this.data.denaro.MO += this.form.get('MO').value;
    this.data.denaro.ME += this.form.get('ME').value;
    this.data.denaro.MA += this.form.get('MA').value;
    this.data.denaro.MR += this.form.get('MR').value;
    this.charService.updateMoney(this.data.charId, this.data.denaro).then(() => {
      this.resetForm();
    });
  }

  public subtractMoney(): void {
    const denominations = ['MP', 'MO', 'ME', 'MA', 'MR']; // Ordine dei tagli di monete da Platino a Rame

    let remainingAmount = 0;
    const amount: { [key: string]: number } = {};

    // Calcoliamo il valore totale richiesto
    for (const denomination of denominations) {
        amount[denomination] = this.form.get(denomination).value;
        remainingAmount += amount[denomination] * this.converter_dict[denomination];
    }

    let i = 0;

    while (remainingAmount > 0 && i < denominations.length) {
        const currentDenomination = denominations[i];

        // Calcoliamo il valore attuale del taglio
        const currentValue = amount[currentDenomination] * this.converter_dict[currentDenomination];

        // Se ci sono monete da sottrarre
        if (currentValue > 0) {
            // Calcoliamo l'importo massimo che possiamo sottrarre da questo taglio senza eccedere il valore rimanente
            const coinsToSubtract = Math.min(Math.floor(remainingAmount / this.converter_dict[currentDenomination]), amount[currentDenomination]);

            // Sottrai le monete
            amount[currentDenomination] -= coinsToSubtract;
            remainingAmount -= coinsToSubtract * this.converter_dict[currentDenomination];
        }

        // Se il valore rimanente è ancora positivo, andiamo al taglio successivo
        if (remainingAmount > 0) {
            i++;
        }
    }

    // Se alla fine il valore rimanente è ancora positivo, significa che non ci sono abbastanza monete nel borsello
    if (remainingAmount > 0) {
        console.log("Non ci sono abbastanza monete nel borsello.");
    } else {
        // Aggiorniamo i valori nel FormGroup
        for (const denomination of denominations) {
            this.form.get(denomination).setValue(amount[denomination]);
        }
    }
}







  public invert() {
    const fromValue = this.convertForm.get('from').value;
    const toValue = this.convertForm.get('to').value;

    this.convertForm.patchValue({
      from: toValue,
      to: fromValue
    });
  }

  public converter_dict: { [key: string]: number } = {
    MP: 1000,
    MO: 100,
    ME: 50,
    MA: 10,
    MR: 1,
  };

  public convertMoney(): void {
    const valueFrom = this.data.denaro[this.convertForm.get('from').value];
    const valueTo = this.data.denaro[this.convertForm.get('to').value];
    const rateFrom = this.converter_dict[this.convertForm.get('from').value];
    const rateTo = this.converter_dict[this.convertForm.get('to').value];

    const amountFrom = valueFrom * rateFrom; // Calcoliamo il valore effettivo della valuta di partenza
    const result = Math.floor(amountFrom / rateTo); // Utilizziamo Math.floor per ottenere un numero intero
    const remainder = amountFrom % rateTo; // Otteniamo il resto corretto

    this.data.denaro[this.convertForm.get('from').value] = Math.floor(remainder / rateFrom); // Aggiorniamo il valore della valuta di partenza con il resto convertito nella valuta di partenza
    this.data.denaro[this.convertForm.get('to').value] += result;
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
