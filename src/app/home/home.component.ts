import { Component, OnInit } from '@angular/core';
import { GpsService } from '../services/gps.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(
        private _gps: GpsService
    ) { }

    get position(): any {
        const toReturn = this._gps.getPosition();
        return toReturn;
    }

    get watchPosition(): any {
        return this._gps.getWatchPosition();
    }

    get isWatchPositionTurnedOn(): boolean {
        return this._gps.getIsWatchPositionTurnedOn();
    }

    ngOnInit(): void {

    }

    stopGPS(): void {
        this._gps.stopWatchPosition();
    }

    startGPS(): void {
        this._gps.startWatchPosition();
    }

}
