import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';

@Component({
    selector: 'app-blocked',
    templateUrl: './blocked.component.html',
    styleUrls: ['./blocked.component.scss']
})
export class BlockedComponent implements OnInit {

    constructor(
        private _global: GlobalService,
    ) { }

    ngOnInit(): void {
        if (!this._global.blockBrowser()) {
            this._global.goTo('/home');
        }
    }

}
