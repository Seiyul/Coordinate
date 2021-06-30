import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

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

    content: string = '';

    title: string = '';

    constructor(
        public dialogRef: MatDialogRef<DialogComponent>
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



}
