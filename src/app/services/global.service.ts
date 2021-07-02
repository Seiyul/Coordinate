import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GlobalService {

    snackbarText: string = '';
    // Default value 
    snackbarTimer: number = 5000;
    hideMatProcess = false;

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

    setSnackbarTimer(value: number): void {
        this.snackbarTimer = value;
    }

    getSnackbarTimer(): number {
        return this.snackbarTimer;
    }

    setSnackbarText(text: string): void {
        this.snackbarText = text;
    }

    getSnackbarText(): string {
        return this.snackbarText;
    }

    setHiddenMatProcess(value: boolean): void {
        this.hideMatProcess = value;
    }

    getHiddenMatProcess(): boolean {
        return this.hideMatProcess;
    }
}
