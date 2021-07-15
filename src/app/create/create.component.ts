import { AfterContentInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { CustomSnackbarComponent } from '../custom-snackbar/custom-snackbar.component';
import { DialogComponent } from '../dialog/dialog.component';
import { GlobalService } from '../services/global.service';
import { MasksService } from '../services/masks.service';
import { QrcodeService } from '../services/qrcode.service';
import { ValidatorsService } from '../services/validators.service';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, AfterContentInit {

    constructor(
        private _qrcode: QrcodeService,
        private _formBuilder: FormBuilder,
        private _activatedRoute: ActivatedRoute,
        private _global: GlobalService,
        public snackbar: MatSnackBar,
        public masks: MasksService,
        public dialog: MatDialog,
    ) { }

    minDate: string = '';

    imageSource: any;
    receivedSession: any;


    form = this._formBuilder.group({
        name: new FormControl('',[Validators.required, Validators.maxLength(20)]),
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
        this.minDate = new Date().toISOString().slice(0, -8);
        this.addPlace();
    }

    ngAfterContentInit(): void {
        this._activatedRoute.queryParams.subscribe(params => {
            if (params.hasOwnProperty('session')) {
                // TODO: Hacer que el setValue se haga de forma progresiva -uno a uno-
                // this.form.setValue(sessionReceived);
                this.setReceivedSession(params);
            }
        });
    }

    newPlace(): FormGroup {
        return this._formBuilder.group({
            latitude: new FormControl('', [Validators.min(-90), Validators.max(90), Validators.required, Validators.maxLength(20), Validators.minLength(6)]),
            longitude: new FormControl('', [Validators.min(-180), Validators.max(180), Validators.required, Validators.maxLength(20), Validators.minLength(6)]),
            description: new FormControl(''),
            status: new FormControl('pending')
        })
    }

    addPlace(): void {
        this.coordinates.push(this.newPlace());
        this.updateValueValidityTimers();
    }

    removePlace(index: any): void {
        this.coordinates.removeAt(index);
        if (this.coordinates.controls.length <= 1) {
            this.form.get('partialTimerCheck')?.setValue(false);
            this.partialTimerCheckClicked();
        }
    }

    generateImage(modificable: boolean): void {
        this._qrcode.convertURLtoQR(this.form.value, modificable)
            .then((value) => {
                this.imageSource = value;
            })
            .catch(error => {
                this._global.setSnackbarTimer(5000);
                this._global.setSnackbarText('Error: El código QR es demasiado grande para ser generado. Utiliza el botón de Link para compartir la partida.');
                this.snackbar.openFromComponent(CustomSnackbarComponent, { duration: this._global.getSnackbarTimer() });
            });
    }

    clearQueryParam(): void {
        this._global.goTo('/create');
        this.receivedSession = null;
    }

    getLink(modificable: boolean): void {
        const link = this._qrcode.getUrl(this.form.value, modificable);
        this._global.copyToClipboard(link);
        this.snackbar.openFromComponent(CustomSnackbarComponent, { duration: this._global.getSnackbarTimer() });
    }

    partialTimerCheckClicked(): void {
        if (this.form.getRawValue().partialTimerCheck === true) {
            this.form.get('partialTimer')!.setValidators([Validators.required, Validators.max(this.maxPartialTime())]);
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
            this.form.get('initialDate')!.setValidators([Validators.required, ValidatorsService.minDate()]);
        }
        else {
            this.form.get('initialDate')!.clearValidators();
            this.form.get('initialDate')!.setValue(null);
        }
    }

    helpButton(): void {
        this._global.setSnackbarTimer(2500);
        this._global.setSnackbarText('Pendiente de redactar 😅');
        this.snackbar.openFromComponent(CustomSnackbarComponent, { duration: this._global.getSnackbarTimer() });
    }

    pasteCoordinates(index: number): void {
        const dialogRef = this.dialog.open(DialogComponent, { disableClose: true });

        dialogRef.componentInstance.pasteMode = true;

        dialogRef.componentInstance.title = 'Pegar coordenadas';
        dialogRef.componentInstance.content = 'Copia y pega las coordenadas directamente desde Google Maps.';

        dialogRef.componentInstance.warnButton = 'Aplicar';
        dialogRef.componentInstance.warnIcon = 'save';

        dialogRef.componentInstance.secondButton = 'Cancelar';
        dialogRef.componentInstance.secondIcon = 'close';

        dialogRef.componentInstance.saveAction.subscribe((res: any) => {
            const array = this.form.get('coordinates')?.value;

            const result = res.value.replaceAll(' ', '');

            const latitude = result.split(',')[0];
            const longitude = result.split(',')[1];

            array.splice(index, 1, {
                'latitude': latitude,
                'longitude': longitude,
                'description': 'Texto de ejemplo',
                'status': 'pending'
            });

            this.form.get('coordinates')?.setValue(array);
        });

        dialogRef.afterClosed().subscribe(() => {
            dialogRef.componentInstance.saveAction.unsubscribe();
        });
    }

    updateValueValidityTimers(): void {
        const minValue = this.coordinates.controls.length * this.form.getRawValue().partialTimer;
        if (this.form.getRawValue().fullTimerCheck === true) {
            this.form.get('fullTimer')!.setValidators([Validators.required, Validators.max(1440), Validators.min(minValue)]);
            this.form.get('fullTimer')!.updateValueAndValidity();
        }
    }

    maxPartialTime(): number {
        return (1440 / this.coordinates.controls.length > 60) ? (60) : Math.floor(1440 / this.coordinates.controls.length);
    }

    setReceivedSession(params: any): void {
        this.receivedSession = JSON.parse(window.atob(params.session));

        if (this.receivedSession.hasOwnProperty('coordinates') &&
            this.receivedSession.hasOwnProperty('errorMargin') &&
            this.receivedSession.hasOwnProperty('partialTimerCheck') &&
            this.receivedSession.hasOwnProperty('partialTimer') &&
            this.receivedSession.hasOwnProperty('fullTimerCheck') &&
            this.receivedSession.hasOwnProperty('fullTimer') &&
            this.receivedSession.hasOwnProperty('initialDateCheck') &&
            this.receivedSession.hasOwnProperty('initialDate')) {

            for (let i = 1; i < this.receivedSession.coordinates.length; i++) {
                this.addPlace();
            }
            this.form.get('coordinates')?.setValue(this.receivedSession.coordinates);
            this.form.get('errorMargin')?.setValue(this.receivedSession.errorMargin);
            this.form.get('partialTimerCheck')?.setValue(this.receivedSession.partialTimerCheck);
            this.form.get('partialTimer')?.setValue(this.receivedSession.partialTimer);
            this.form.get('fullTimerCheck')?.setValue(this.receivedSession.fullTimerCheck);
            this.form.get('fullTimer')?.setValue(this.receivedSession.fullTimer);
            this.form.get('initialDateCheck')?.setValue(this.receivedSession.initialDateCheck);
            this.form.get('initialDate')?.setValue(this.receivedSession.initialDate);
        }
        else {
            this.clearQueryParam();
        }
    }

    clearSession(): void {
        const dialogRef = this.dialog.open(DialogComponent, { disableClose: true });

        dialogRef.componentInstance.pasteMode = false;

        dialogRef.componentInstance.title = 'Borrar datos';
        dialogRef.componentInstance.content = 'Se van a borrar los datos de la partida. ¿Desea continuar?';
        dialogRef.componentInstance.subcontent = 'Puedes recuperar la partida mediante el mismo link.'

        dialogRef.componentInstance.warnButton = 'Borrar';
        dialogRef.componentInstance.warnIcon = 'delete';

        dialogRef.componentInstance.secondButton = 'Cancelar';
        dialogRef.componentInstance.secondIcon = 'close';

        dialogRef.afterClosed().toPromise().then((res) => {
            if (res) {
                this.clearQueryParam();
                this.form.reset();
                while (this.coordinates.length !== 0) {
                    this.coordinates.removeAt(0);
                }
                this.addPlace();
            }
        });
    }
}
