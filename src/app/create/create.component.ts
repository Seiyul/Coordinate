import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { CustomSnackbarComponent } from '../custom-snackbar/custom-snackbar.component';
import { GlobalService } from '../services/global.service';
import { MasksService } from '../services/masks.service';
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
        public snackbar: MatSnackBar,
        public masks: MasksService
    ) { }



    minDate: string = '';

    imageSource: any;
    receivedSession: any;


    form = this._formBuilder.group({
        coordinates: new FormArray([]),
        errorMargin: new FormControl(''),
        partialTimerCheck: new FormControl(false),
        partialTimer: new FormControl(''),
        fullTimerCheck: new FormControl(false),
        fullTimer: new FormControl(''),
        initialDateCheck: new FormControl(false),
        initialDate: new FormControl('')
    })


    get coordinates(): FormArray {
        return this.form.get('coordinates') as FormArray;
    }

    ngOnInit(): void {
        this._activatedRoute.queryParams.subscribe(params => {
            if (params.hasOwnProperty('session')) {
                this.receivedSession = JSON.parse(window.atob(params.session));
                // TODO: Hacer que el setValue se haga de forma progresiva -uno a uno-
                // this.form.setValue(sessionReceived);
            }
        });
        this.minDate = new Date().toISOString().slice(0, -8);
        this.addPlace();
    }

    newPlace(): FormGroup {
        return this._formBuilder.group({
            latitude: new FormControl('', [Validators.min(-90), Validators.max(90), Validators.required, Validators.maxLength(12), Validators.minLength(6)]),
            longitude: new FormControl('', [Validators.min(-180), Validators.max(180), Validators.required, Validators.maxLength(12), Validators.minLength(6)])
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

    generateImage(): void {
        this._qrcode.convertURLtoQR(this.form.value)
            .then((value) => {
                this.imageSource = value;
            })
            .catch(error => {
                console.log('error -->', error);
            });
    }

    clearQueryParam(): void {
        this._global.goTo('/create');
        this.receivedSession = null;
    }

    getLink(): void {
        const link = this._qrcode.getUrl(this.form.value);
        const el = document.createElement('textarea');
        el.value = link;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        this.openCustomSnackbar();
    }

    partialTimerCheckClicked(): void {
        if (this.form.getRawValue().partialTimerCheck === true) {
            this.form.get('partialTimer')!.setValidators([Validators.required, Validators.max(60)]);
        }
        else {
            this.form.get('partialTimer')!.clearValidators();
            this.form.get('partialTimer')!.setValue(null);
        }
    }

    fullTimerCheckClicked(): void {
        if (this.form.getRawValue().fullTimerCheck === true) {
            this.form.get('fullTimer')!.setValidators([Validators.required, Validators.max(1440)]);
        }
        else {
            this.form.get('fullTimer')!.clearValidators();
            this.form.get('fullTimer')!.setValue(null);
        }
    }

    initialDateCheckClicked(): void {
        if (this.form.getRawValue().initialDateCheck === true) {
            this.form.get('initialDate')!.setValidators([Validators.required]);
        }
        else {
            this.form.get('initialDate')!.clearValidators();
            this.form.get('initialDate')!.setValue(null);
        }
    }

    openCustomSnackbar(): void {
        this._global.setSnackbarTimer(3500);
        this._global.setSnackbarText('Copiado en el portapapeles');
        this.snackbar.openFromComponent(CustomSnackbarComponent, { duration: this._global.getSnackbarTimer() });
    }

    helpButton(): void {
        this._global.setSnackbarTimer(2500);
        this._global.setSnackbarText('Pendiente de redactar 😅');
        this.snackbar.openFromComponent(CustomSnackbarComponent, { duration: this._global.getSnackbarTimer() });
    }
}
