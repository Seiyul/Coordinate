import { AfterContentInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../services/global.service';
import { GpsService } from '../services/gps.service';
import { Base64 } from 'js-base64';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../custom-snackbar/custom-snackbar.component';

@Component({
    selector: 'app-play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit, AfterContentInit {

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _global: GlobalService,
        private _gps: GpsService,
        private _dialog: MatDialog,
        private _snackbar: MatSnackBar
    ) { }

    get position(): any {
        return this._gps.getPosition();
    }

    get errorMargin(): any {
        if (this._gps.getPosition()) {
            return this._gps.getPosition().accuracy < 15 ? 15 : this._gps.getPosition().accuracy > 100 ? 100 : this._gps.getPosition().accuracy;
        }
    }

    receivedSession: any;
    initialDate: any;
    dateToPrint: any;

    time = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    };

    lastDistance: any;
    actualDistance: any;

    // Valor que comprueba si el autostart está activo
    isAutostartEnabled = false;

    // Si se ha terminado la fecha de inicio
    isTimeFinished = false;

    // Si se ha terminado el temporizador total con fecha de inicio
    isGameOver = false;

    // Si hay una partida en el localStorage
    hasAnActiveSession = false;

    // Si hay una partida empezada
    isSessionStarted = false;

    ngOnInit(): void {
        if (!this._gps.getIsWatchPositionTurnedOn()) {
            this._gps.startWatchPosition();
        }
    }

    saveCurrentGame(): void {
        const session = Base64.encode(this.receivedSession);
        localStorage.setItem('session', session)
    }

    ngAfterContentInit(): void {
        this._activatedRoute.queryParams.subscribe(params => {
            if (localStorage.getItem('session') !== null) {
                if (typeof localStorage.getItem('session') === 'string') {
                    this.receivedSession = JSON.parse(Base64.decode(localStorage.getItem('session') as string));
                    this.isAutostartEnabled = true;
                    this.checkReceivedSession();
                }
                else {
                    this.goHome();
                }
            }
            else if (params.hasOwnProperty('session')) {
                this.receivedSession = JSON.parse(Base64.decode(params.session));
                this.checkReceivedSession();
            }
            else {
                this.goHome();
            }
        });
    }

    goHome(): void {
        this._global.goTo('/home');
    }

    checkReceivedSession(): void {
        if (this.receivedSession.hasOwnProperty('name') &&
            this.receivedSession.hasOwnProperty('coordinates') &&
            this.receivedSession.hasOwnProperty('errorMargin') &&
            this.receivedSession.hasOwnProperty('partialTimerCheck') &&
            this.receivedSession.hasOwnProperty('partialTimer') &&
            this.receivedSession.hasOwnProperty('fullTimerCheck') &&
            this.receivedSession.hasOwnProperty('fullTimer') &&
            this.receivedSession.hasOwnProperty('initialDateCheck') &&
            this.receivedSession.hasOwnProperty('initialDate')) {
            for (let i = 0; i < this.receivedSession.coordinates.length; i++) {
                if (this.receivedSession.coordinates[i].status !== 'waiting') {
                    this.isSessionStarted = true;
                }
            }
            if (this.receivedSession.initialDateCheck) {
                this.initialDate = this.receivedSession.initialDate + ':01.000';
                this.refreshDate();
            }
            else {
                this.isTimeFinished = true;
            }
        }
        else {
            this.goHome();
        }
    }

    refreshDate(): void {
        const countDownDate = new Date(this.initialDate).getTime();

        const now = new Date().getTime();
        const timeleft = countDownDate - now;

        const days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

        this.time.days = days;
        this.time.hours = hours;
        this.time.minutes = minutes;
        this.time.seconds = seconds;

        if (this.time.days <= 0 &&
            this.time.hours <= 0 &&
            this.time.minutes <= 0 &&
            this.time.seconds <= 0) {
            if (this.isAutostartEnabled) {
                this.start();
            }
            this.isTimeFinished = true;
        }
        else {
            this.isTimeFinished = false;
            setTimeout(() => {
                this.refreshDate();
            }, 1000);
        }
    }

    calculateFinalDate(): any {
        const finalDateTime = new Date(this.initialDate).getTime() + (this.receivedSession.fullTimer * 60 * 1000);
        return new Date(finalDateTime);
    }

    setAutostart(): void {
        const dialogRef = this._dialog.open(DialogComponent, { disableClose: true });
        dialogRef.componentInstance.title = 'Comenzar automáticamente la partida';
        dialogRef.componentInstance.content = '¿Deseas que la partida comience automáticamente? Se te guardarán los datos de la partida, pero no podrás navegar por la aplicación hasta que la partida comience.';

        dialogRef.componentInstance.warnButton = 'Sí';
        dialogRef.componentInstance.warnIcon = 'save';

        dialogRef.componentInstance.secondButton = 'No';
        dialogRef.componentInstance.secondIcon = 'close';

        dialogRef.afterClosed().toPromise().then((res) => {
            this._global.setSnackbarTimer(2500);
            if (res) {
                this.isAutostartEnabled = true;
                this._gps.startWatchPosition();
                this._global.setSession(this.receivedSession);
            }
        });
    }

    start(): void {
        this.isSessionStarted = true;
        for (let i = 0; i < this.receivedSession.coordinates.length; i++) {
            if (this.receivedSession.coordinates[i].status === 'pending') {
                this.receivedSession.coordinates[i].status === 'current';
                break;
            }
        }
        this._global.setSession(this.receivedSession);
        this._gps.startWatchPosition();
    }


    distance(position: any): any {
        this.lastDistance = this.actualDistance;

        if (this.receivedSession.coordinates.filter((el: any) => el.status === 'current' || el.status === 'waiting').length === 0) {
            this.endOfGame();
        }
        else {
            // Current values
            if (position) {
                if (this.receivedSession.coordinates.filter((el: any) => el.status === 'current').length === 0 &&
                    this.receivedSession.coordinates.filter((el: any) => el.status === 'finished').length === 0) {
                    this.receivedSession.coordinates[0].status = 'current';
                }

                const latitudeChosen = this.receivedSession.coordinates.filter((el: any) => el.status === 'current')[0].latitude;
                const longitudeChosen = this.receivedSession.coordinates.filter((el: any) => el.status === 'current')[0].longitude;

                const latitude = position.latitude;
                const longitude = position.longitude;

                const R = 6371e3;
                const φ1 = latitude * Math.PI / 180; // φ, λ in radians
                const φ2 = latitudeChosen * Math.PI / 180;
                const Δφ = (latitudeChosen - latitude) * Math.PI / 180;
                const Δλ = (longitudeChosen - longitude) * Math.PI / 180;

                const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                    Math.cos(φ1) * Math.cos(φ2) *
                    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const d = R * c; // in metres

                const result = d;
                this.actualDistance = result;

                const precision = (this.errorMargin < 15) ? 15 : 100;
                const resultToShow = parseFloat((result).toFixed(2));

                if (resultToShow <= precision) {
                    console.log('resultToShow -->', resultToShow);
                    console.log('precision -->', precision);


                    const coords = this.receivedSession.coordinates;

                    for (let i = 0; i < coords.length; i++) {
                        if (coords[i].status === 'current') {
                            coords[i].status = 'finished';
                            if (i < coords.length - 1) {
                                coords[i + 1].status = 'current';
                                this._global.setSession(this.receivedSession);
                                break;
                            }
                            else {
                                this.endOfGame();
                            }
                        }
                    }
                }

                return resultToShow;
            }
            else {
                return 'Calculando...';
            }
        }
    }

    animateValue(obj: any, start: any, end: any, duration: any) {
        let startTimestamp: any = null;
        const step = (timestamp: any) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    endOfGame(): void {
        this.isGameOver = true;
        this._global.setSnackbarTimer(5500);
        this._global.setSnackbarText('¡¡Fin del juego!! Enhorabuena 😊');
        this._snackbar.openFromComponent(CustomSnackbarComponent, { duration: this._global.getSnackbarTimer() });
        this._global.setSession(null);
        localStorage.removeItem('session');
        setTimeout(() => {
            this._global.goTo('/home');
        }, 5500);
    }

}
