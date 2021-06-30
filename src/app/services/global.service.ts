import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GlobalService {

    constructor(
        private _router: Router
    ) { }

    blockBrowser(): boolean {
        if (environment.production) {
            const isMobile = /IEMobile/i.test(navigator.userAgent) ||
                /Android/i.test(navigator.userAgent) ||
                /BlackBerry/i.test(navigator.userAgent) ||
                /iPhone|iPad|iPod/i.test(navigator.userAgent);
            return !isMobile;
        }
        else {
            return false;
        }
    }

    goTo(route: string): void {
        this._router.navigate([route]);
    }
}
