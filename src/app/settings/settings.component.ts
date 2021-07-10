import { Component, OnInit } from '@angular/core';
import { GpsService } from '../services/gps.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    get isWatchPositionTurnedOn(): boolean {
        return this._gps.getIsWatchPositionTurnedOn();
    }

    constructor(
        private _gps: GpsService
    ) { }

    ngOnInit(): void {
    }

    stopGPS(): void {
        this._gps.stopWatchPosition();
    }

    startGPS(): void {
        this._gps.startWatchPosition();
    }


}
