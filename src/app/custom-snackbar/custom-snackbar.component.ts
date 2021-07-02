import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';

@Component({
    selector: 'app-custom-snackbar',
    templateUrl: './custom-snackbar.component.html',
    styleUrls: ['./custom-snackbar.component.scss']
})
export class CustomSnackbarComponent implements OnInit {

    progressBarValue = 0;
    snackbarValue = '';

    constructor(
        private _global: GlobalService
    ) { }

    ngOnInit(): void {
        this.incrementValue();
        this.snackbarValue = this._global.getSnackbarText();
    }

    incrementValue(): void {
        const timePerPercentage = this._global.getSnackbarTimer() / 100;
        for (let i = 1; i <= 100; i++) {
            setTimeout(() => {
                this.progressBarValue = i;
            }, timePerPercentage * i);
        }
    }
}
