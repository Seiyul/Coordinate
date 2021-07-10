import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../services/global.service';
import { GpsService } from '../services/gps.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(
        private _gps: GpsService,
        private _global: GlobalService,
        private _router: Router
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

    linkList: any;

    isPwa: boolean = false;

    ngOnInit(): void {
        this.linkList = this._global.getLinkList();
        this.isPwa = ["fullscreen", "standalone", "minimal-ui"].some(
            (displayMode) => window.matchMedia('(display-mode: ' + displayMode + ')').matches
        );
    }
    routerChange(event: any): void {
        if (event?.option?.value) {
            this._router.navigate([event.option.value]);
        }
    }

}
