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
            return !this.isMobile();
        }
        else {
            return false;
        }
    }

    isMobile(): boolean {
        const isMobile = /IEMobile/i.test(navigator.userAgent) ||
            /Android/i.test(navigator.userAgent) ||
            /BlackBerry/i.test(navigator.userAgent) ||
            /iPhone|iPad|iPod/i.test(navigator.userAgent);
        return isMobile;
    }

    goTo(route: string): void {
        this._router.navigate([route]);
    }
}
