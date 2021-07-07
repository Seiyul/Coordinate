import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
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

    linkList = [{
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

    get isMobile(): boolean {
        return this._global.isMobile();
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
        this.setVersion();
        this.startNavigation();
    }

    routerChange(event: any): void {
        if (event?.option?.value) {
            this._router.navigate([event.option.value]);
        }
    }

    isCurrentLink(link: any): boolean {
        return this._router.url === link;
    }


    closeModal(): void {
        const dialogRef = this.dialog.open(DialogComponent, { disableClose: true });
        dialogRef.componentInstance.title = 'Salir de la partida';
        dialogRef.componentInstance.content = '¿Deseas salir de la partida?';
        dialogRef.afterClosed().toPromise().then((res) => {
            this._global.setSnackbarTimer(2500);
            if (res) {
                this._global.setSnackbarText('Botón de salir. Funcionalidad pendiente de implantación.');
                this.snackbar.openFromComponent(CustomSnackbarComponent, { duration: this._global.getSnackbarTimer() });
            }
            else {
                this._global.setSnackbarText('Botón de permanecer. No hace nada.');
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

    setVersion(): void {
        // if (environment.production) {
        //     const url = window.location.origin + '/Coordinate/' + 'timestamp.txt';
        //     this._http.get(url, { responseType: 'text' as 'json' }).subscribe((response: any) => {
        //         this._global.setLatestVersion(response);
        //     }, (err: any) => {
        //         this._global.setLatestVersion('Error: ' + err);
        //     });
        // }
        // else {
        //     this._global.setLatestVersion('Local');
        // }
        this._global.setLatestVersion('Work in process');
    }

    startNavigation(): void {
        this._gps.startWatchPosition();
    }
}
