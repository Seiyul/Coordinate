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

    showSpinner = false;

    constructor(
        private _gps: GpsService
    ) { }

    ngOnInit(): void {
    }

    stopGPS(): void {
        this._gps.stopWatchPosition();
    }

    startGPS(): void {
        this.showSpinner = true;
        setTimeout(() => {
            this._gps.startWatchPosition();
        }, 1000);
    }

    get position(): any {
        if (this._gps.getPosition()) {
            this.showSpinner = false;
        }
        return this._gps.getPosition();
    }

    goToGoogleMaps(): void {
        const latitude = this.position.latitude;
        const longitude = this.position.longitude;

        const url = 'https://www.google.com/maps/search/?api=1&query=' + latitude + '%2C' + longitude;

        window.open(url, '_blank');
    }


}
