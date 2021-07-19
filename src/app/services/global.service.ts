import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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

    version: any;
    versionDate: any;

    session: any;

    list = [{
        name: 'Inicio',
        icon: 'home',
        link: '/home'
    },
    {
        name: 'Crear partida',
        icon: 'add_circle_outline',
        link: '/create'
    },
    {
        name: 'Ajustes',
        icon: 'settings',
        link: '/settings'
    },
    {
        name: 'Acerca de',
        icon: 'help',
        link: '/about'
    }];

    constructor(
        private _router: Router,
        public snackbar: MatSnackBar
    ) { }

    blockBrowser(): boolean {
        if (environment.production) {
            return !this.isMobile() && !this.isLocalhost();
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

    isLocalhost(): boolean {
        return window.location.host.includes('localhost') || window.location.host.includes('127.0.0.1');
    }

    goTo(route: string): void {
        this._router.navigate([route]);
    }

    ////////////////////////////////////////////////////

    setSnackbarTimer(value: number): void {
        this.snackbarTimer = value;
    }

    getSnackbarTimer(): number {
        return this.snackbarTimer;
    }

    ////////////////////////////////////////////////////

    setSnackbarText(text: string): void {
        this.snackbarText = text;
    }

    getSnackbarText(): string {
        return this.snackbarText;
    }

    ////////////////////////////////////////////////////

    setHiddenMatProcess(value: boolean): void {
        this.hideMatProcess = value;
    }

    getHiddenMatProcess(): boolean {
        return this.hideMatProcess;
    }

    ////////////////////////////////////////////////////

    getLatestVersion(): any {
        return this.version;
    }

    setLatestVersion(version: any): void {
        this.version = version;
        localStorage.setItem('latestVersion', this.version);
    }

    ////////////////////////////////////////////////////

    getLatestVersionDate(): any {
        return this.versionDate;
    }

    setLatestVersionDate(versionDate: any): void {
        this.versionDate = versionDate;
        localStorage.setItem('latestVersionDate', this.versionDate);
    }

    ////////////////////////////////////////////////////

    getSession(): any {
        if (!this.session) {
            this.session = localStorage.getItem('session');
        }
        return this.session;
    }

    setSession(session: any): void {
        this.session = session;
        localStorage.setItem('session', this.session);
    }

    ////////////////////////////////////////////////////

    getLinkList(): any {
        return this.list;
    }

    ////////////////////////////////////////////////////

    copyToClipboard(textToCopy: string) {
        const el = document.createElement('textarea');
        el.value = textToCopy;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        this.setSnackbarTimer(1500);
        this.setSnackbarText('Copiado en el portapapeles');
    }

    getRandomCoordinates(): void {
        const coordinates = [
            '48.85825315585742, 2.294500670904264',
            '40.41662315573044, -3.7038200249409394',
            '41.890219150716966, 12.492312571621001',
            '52.5162824493123, 13.377770578122625',
            '52.3731289456569, 4.89236714297847',
            '59.939858727150245, 30.314410151513208'
        ];

        const index = Math.floor(Math.random() * (coordinates.length - 1));
        this.copyToClipboard(coordinates[index]);
    }

}
