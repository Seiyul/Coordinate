import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../services/global.service';
import { QrcodeService } from '../services/qrcode.service';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

    constructor(
        private _qrcode: QrcodeService,
        private _formBuilder: FormBuilder,
        private _activatedRoute: ActivatedRoute,
        private _global: GlobalService,
        public snackbar: MatSnackBar
    ) { }

    imageSource: any;
    receivedSession: any;

    get coordinates(): FormArray {
        return this.form.get('coordinates') as FormArray;
    }

    newPlace(): FormGroup {
        return this._formBuilder.group({
            latitude: '',
            longitude: ''
        })
    }

    addPlace(): void {
        this.coordinates.push(this.newPlace());
    }

    removePlace(index: any): void {
        this.coordinates.removeAt(index);
    }

    print(): void {
        console.log(this.form.value);
    }

    form = this._formBuilder.group({
        coordinates: new FormArray([]),
        errorMargin: new FormControl(''),
        partialTimerCheck: new FormControl(''),
        partialTimer: new FormControl(''),
        fullTimerCheck: new FormControl(''),
        fullTimer: new FormControl(''),
        initialDateCheck: new FormControl(''),
        initialDate: new FormControl('')
    })

    ngOnInit(): void {
        this._activatedRoute.queryParams.subscribe(params => {
            if (params.hasOwnProperty('session')) {
                this.receivedSession = JSON.parse(window.atob(params.session));
                // TODO: Hacer que el setValue se haga de forma progresiva -uno a uno-
                // this.form.setValue(sessionReceived);
            }
        });
        this.addPlace();
    }

    generateImage(): void {
        this._qrcode.convertURLtoQR(this.form.value)
            .then((value) => {
                this.imageSource = value;
            })
            .catch(error => {
                console.log('error -->', error);
            });
    }

    partialCleaning(): void {
        this.form.get('partialTimer')!.setValue('');
    }

    totalCleaning(): void {
        this.form.get('fullTimer')!.setValue('');
    }

    clearQueryParam(): void {
        this._global.goTo('/create');
        this.receivedSession = null;
    }
}
