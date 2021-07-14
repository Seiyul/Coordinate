import { AfterContentInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../services/global.service';

@Component({
    selector: 'app-play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit, AfterContentInit {

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _global: GlobalService
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

        if (this.receivedSession.hasOwnProperty('coordinates') &&
            this.receivedSession.hasOwnProperty('errorMargin') &&
            this.receivedSession.hasOwnProperty('partialTimerCheck') &&
            this.receivedSession.hasOwnProperty('partialTimer') &&
            this.receivedSession.hasOwnProperty('fullTimerCheck') &&
            this.receivedSession.hasOwnProperty('fullTimer') &&
            this.receivedSession.hasOwnProperty('initialDateCheck') &&
            this.receivedSession.hasOwnProperty('initialDate')) {
            // Válido
            if (this.receivedSession.initialDateCheck) {
                this.initialDate = this.receivedSession.initialDate + ':00.000';
                this.compareCurrentDate();
            }
        }
        else {
            this._global.goTo('/home');
        }
    }

    compareCurrentDate(): void {
        this.refreshDate();
    }

    refreshDate(): void {
        // let currentDate = new Date().getTime();
        // const offsetCurrent = new Date(currentDate).getTimezoneOffset();
        // currentDate = new Date(currentDate).getTime() + (offsetCurrent * 60 * 1000);
        // // const initialDate = new Date(this.initialDate).getTime();
        // const offsetInitial = new Date(this.initialDate).getTimezoneOffset();
        // const initialDate = new Date(this.initialDate).getTime() + (offsetInitial * 60 * 1000);
        // console.log('currentDate -->', currentDate);
        // console.log('initialDate -->', initialDate);
        // console.log('offsetCurrent -->', offsetCurrent);
        // console.log('offsetInitial -->', offsetInitial);




        // if (initialDate < currentDate) {
        //     this.dateToPrint = (currentDate - initialDate);
        //     this.dateToPrint = this.date(this.dateToPrint);

        //     setTimeout(() => {
        //         this.refreshDate();
        //     }, 1000);
        // }
        // else {
        //     console.log('stop');
        // }

        var countDownDate = new Date(this.initialDate).getTime();

        var now = new Date().getTime();
        var timeleft = countDownDate - now;

        // Calculating the days, hours, minutes and seconds left 
        var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
        var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

        this.time.days = days;
        this.time.hours = hours;
        this.time.minutes = minutes;
        this.time.seconds = seconds;



        setTimeout(() => {
            this.refreshDate();
        }, 1000);

    }

    date(dateReceived?: any): string {
        const date = new Date(dateReceived);
        return (date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()) + ':' +
            (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ':' +
            (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds())
    }


}
