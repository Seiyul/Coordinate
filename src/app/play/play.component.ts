import { AfterContentInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../services/global.service';
import { GpsService } from '../services/gps.service';

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

    isTimeFinished = false;

    ngOnInit(): void {
    }

    ngAfterContentInit(): void {
        this._activatedRoute.queryParams.subscribe(params => {
            if (params.hasOwnProperty('session')) {
                this.setReceivedSession(params);
            }
        });
    }

    setReceivedSession(params: any): void {
        this.receivedSession = JSON.parse(window.atob(params.session));

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
            else
            {
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
            this.time.seconds <= 0)
            {
                this.isTimeFinished = true;
            }    
        else
        {
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
