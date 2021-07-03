import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { GlobalService } from '../services/global.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../custom-snackbar/custom-snackbar.component';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

    warnButton: string = '';
    warnIcon: string = '';

    secondButton: string = '';
    secondIcon: string = '';

    title: string = '';

    content: string = '';

    subcontent: string = '';


    /////////////////////////////////////////////////

    pasteMode: boolean = false;

    saveAction: EventEmitter<any> = new EventEmitter();

    getCoordinatesControl = new FormControl('');

    /////////////////////////////////////////////////  

    constructor(
        public dialogRef: MatDialogRef<DialogComponent>,
        private _global: GlobalService,
        public snackbar: MatSnackBar
    ) { }



    ngOnInit(): void {
        if (!this.warnButton) {
            this.warnButton = 'Salir';
        }
        if (!this.warnIcon) {
            this.warnIcon = 'logout';
        }
        if (!this.secondButton) {
            this.secondButton = 'Permanecer';
        }
        if (!this.secondIcon) {
            this.secondIcon = 'emoji_people';
        }
        if (!this.content) {
            this.content = 'Acción';
        }
        if (!this.title) {
            this.title = 'Coordinate';
        }
    }

    close(): void {
        this.dialogRef.close(true);
    }

    save(): void {
        this.saveAction.emit(this.getCoordinatesControl);
        this.dialogRef.close();
    }

    helpButton(): void {
        this._global.setSnackbarTimer(2500);
        this._global.setSnackbarText('Pendiente de redactar 😅');
        this.snackbar.openFromComponent(CustomSnackbarComponent, { duration: this._global.getSnackbarTimer() });
    }

    getRandomCoordinates(): void {
        this._global.getRandomCoordinates();
        this.snackbar.openFromComponent(CustomSnackbarComponent, { duration: this._global.getSnackbarTimer() });
    }


}
