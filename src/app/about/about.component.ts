import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
        private _global: GlobalService
    ) { }

    version: any;

    ngOnInit(): void {
        this.version = this._global.getLatestVersion();
    }
}
