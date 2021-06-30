import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DialogComponent } from './dialog/dialog.component';
import { GlobalService } from './services/global.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'Coordinate';

    block = false;

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
    }];

    get isMobile(): boolean {
        return this._global.isMobile();
    }

    constructor(
        private _router: Router,
        public dialog: MatDialog,
        private _global: GlobalService
    ) {
        if (this._global.blockBrowser()) {
            this.block = true;
            this._router.navigate(['/blocked']);
        }
    }

    routerChange(event: any): void {
        this._router.navigate([event.option.value]);
    }

    isCurrentLink(link: any): boolean {
        return this._router.url === link;
    }

    closeModal(): void {
        const dialogRef = this.dialog.open(DialogComponent, { disableClose: true });
        dialogRef.componentInstance.title = 'Salir de la partida';
        dialogRef.componentInstance.content = '¿Deseas salir de la partida?';
        dialogRef.afterClosed().toPromise().then((res) => {
            if (res) {
                console.log('Botón de salir');
            }
            else {
                console.log('Botón de permanecer');
            }
        });
    }
}
