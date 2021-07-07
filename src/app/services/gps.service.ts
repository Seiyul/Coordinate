import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GpsService {

    constructor() { }

    watchPosition: any;
    position: any;
    errors: any;

    isWatchPositionTurnedOn = false;

    getWatchPosition(): any {
        return this.watchPosition;
    }

    setWatchPosition(watchPosition: any): void {
        this.watchPosition = watchPosition;
    }

    stopWatchPosition(): void {
        this.isWatchPositionTurnedOn = false;
        navigator.geolocation.clearWatch(this.watchPosition);
    }

    getPosition(): any {
        return this.position;
    }

    setPosition(position: any): void {
        this.position = position.coords;
    }

    getError(): any {
        return this.errors;
    }

    setError(error: any): void {
        this.errors = error;
    }

    startWatchPosition(): void {
        this.watchPosition = navigator.geolocation.watchPosition(
            // Success
            (pos: any) => {
                this.isWatchPositionTurnedOn = true;
                this.setPosition(pos);
            },
            // Error
            (err: any) => {
                this.setError(err);
            },
            // Options
            {
                enableHighAccuracy: true,
                timeout: 60000,
                maximumAge: 0
            });
    }

    getIsWatchPositionTurnedOn(): any {
        return this.isWatchPositionTurnedOn;
    }
}
