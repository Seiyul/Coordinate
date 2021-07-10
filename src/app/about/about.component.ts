import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { GlobalService } from '../services/global.service';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

    constructor(
        private _http: HttpClient,
        private _global: GlobalService,
        private _router: Router
    ) { }

    get version(): any {
        return this._global.getLatestVersion();
    }

    get versionDate(): any {
        return this._global.getLatestVersionDate();
    }

    loading = true;

    ngOnInit(): void {
        if (!this.version) {
            this._http.get('https://seiyul.github.io/Coordinate/version.txt', { responseType: 'text' }).subscribe((version: any) => {
                this._http.get('https://seiyul.github.io/Coordinate/timestamp.txt', { responseType: 'text' }).subscribe((timestamp: any) => {
                    this._global.setLatestVersion(version);
                    this._global.setLatestVersionDate(timestamp);
                    setTimeout(() => {
                        this.loading = false;
                    }, 1000);
                });
            });
        }
        else {
            this.loading = false;
        }
    }

    back(): void {
        this._router.navigate(['/home']);
    }
}
