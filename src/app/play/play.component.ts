import { AfterContentInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../services/global.service';
import { GpsService } from '../services/gps.service';
import { Base64 } from 'js-base64';

@Component({
    selector: 'app-play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit, AfterContentInit {

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _global: GlobalService,
        private _gps: GpsService
    ) { }

    receivedSession: any;
    initialDate: any;
    dateToPrint: any;

    time = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    };


    // Si se ha terminado la fecha de inicio
    isTimeFinished = false;

    // Si se ha terminado el temporizador total con fecha de inicio
    isGameOver = false;

    // Si hay una partida en el localStorage
    hasAnActiveSession = false;

    ngOnInit(): void {
        if (localStorage.getItem('currentSession') !== null) {
            if (typeof localStorage.getItem('currentSession') === 'string') {
                this.receivedSession = Base64.decode(localStorage.getItem('currentSession') as string);
            }
            this.checkReceivedSession();
        }
    }

    saveCurrentGame(): void {
        const session = Base64.encode(this.receivedSession);
        localStorage.setItem('currentSession', session)
    }

    ngAfterContentInit(): void {
        this._activatedRoute.queryParams.subscribe(params => {
            if (params.hasOwnProperty('session')) {
                this.receivedSession = JSON.parse(Base64.decode(params.session));
                this.checkReceivedSession();
            }
        });
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
            if (this.receivedSession.initialDateCheck) {
                this.initialDate = this.receivedSession.initialDate + ':01.000';
                this.refreshDate();
            }
            else {
                this.isTimeFinished = true;
            }
        }
        else {
            this._global.goTo('/home');
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

    start(): void {
        this._gps.startWatchPosition();
    }
}
