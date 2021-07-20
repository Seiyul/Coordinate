import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CustomSnackbarComponent } from './custom-snackbar/custom-snackbar.component';
import { DialogComponent } from './dialog/dialog.component';
import { GlobalService } from './services/global.service';
import { GpsService } from './services/gps.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'Coordinate';

    block = false;

    isPwa = false;

    version: any;

    dateToPrint: string = '';

    linkList: any;

    get isThereAnActiveSession(): any {
        const session = this._global.getSession();
        if (!session) {
            return false;
        }
        else {
            const currentPlace = window.location.href.split('/')[window.location.href.split('/').length - 1];
            if (!currentPlace.includes('play') && !currentPlace.includes('settings')) {
                this._global.goTo('/play');
            }
            return true;
        }
    }

    get isMobile(): boolean {
        return this._global.isMobile();
    }

    get isWatchPositionTurnedOn(): boolean {
        return this._gps.getIsWatchPositionTurnedOn()
    }

    constructor(
        private _router: Router,
        public dialog: MatDialog,
        private _global: GlobalService,
        public snackbar: MatSnackBar,
        private _http: HttpClient,
        private _gps: GpsService
    ) {
        if (this._global.blockBrowser()) {
            this.block = true;
            this._router.navigate(['/blocked']);
        }
    }

    ngOnInit(): void {
        this.installPwa();
        this.checkIfComesFromPwa();
        this.lockOrientationScreen();
        this.refreshDate();
        this.linkList = this._global.getLinkList();
        this.checkIfHasSession();
    }

    routerChange(event: any): void {
        if (event?.option?.value) {
            this._router.navigate([event.option.value]);
        }
    }

    isCurrentLink(link: any): boolean {
        return this._router.url === link;
    }

    lockOrientationScreen(): void {
        screen.orientation.lock('portrait').then(
            (success: any) => {
                console.log('Success', success);
            },
            (error: any) => {
                console.log('Error: ', error);
            }
        );
    }


    closeModal(): void {
        const dialogRef = this.dialog.open(DialogComponent, { disableClose: true });
        dialogRef.componentInstance.title = 'Salir de la partida';
        dialogRef.componentInstance.content = '¿Deseas salir de la partida?';
        dialogRef.afterClosed().toPromise().then((res) => {
            this._global.setSnackbarTimer(3500);
            if (res) {
                this._global.setSnackbarText('Has salido de la partida correctamente');
                localStorage.removeItem('session');
                this._global.setSession(null);
                this._global.goTo('/home');
                this.snackbar.openFromComponent(CustomSnackbarComponent, { duration: this._global.getSnackbarTimer() });
            }
        });
    }

    installPwa(): void {
        let deferredPrompt: any;
        const addBtn = document.querySelector('.add-button') as HTMLElement;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            addBtn.addEventListener('click', (e) => {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult: any) => {
                    if (choiceResult.outcome === 'accepted') {
                        this._global.setSnackbarTimer(3500);
                        this._global.setSnackbarText('Gracias por instalar la aplicación');
                        this.snackbar.openFromComponent(CustomSnackbarComponent, { duration: this._global.getSnackbarTimer() });
                        localStorage.setItem('hasInstalledApp', 'true');
                        this.isPwa = true;
                    } else {
                        console.log('User dismissed the A2HS prompt');
                    }
                    deferredPrompt = null;
                });
            });
        });
    }

    checkIfComesFromPwa(): void {
        this.isPwa = ["fullscreen", "standalone", "minimal-ui"].some(
            (displayMode) => window.matchMedia('(display-mode: ' + displayMode + ')').matches
        );
    }

    startNavigation(): void {
        this._gps.startWatchPosition();
    }

    refreshDate(): void {
        this.dateToPrint = this.date();
        setTimeout(() => {
            this.refreshDate();
        }, 1000);
    }

    date(): string {
        const date = new Date();
        return (date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()) + ':' +
            (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ':' +
            (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds())
    }

    checkIfHasSession(): void {
        if (this._global.getSession()) {
            this._global.goTo('/play');
        }
    }
}
