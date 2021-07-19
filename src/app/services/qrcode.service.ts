import { Injectable } from '@angular/core';
import { Base64 } from 'js-base64';

@Injectable({
    providedIn: 'root'
})
export class QrcodeService {
    qrcode = require('qrcode');

    constructor() { }

    convertURLtoQR = (data: any, modificable: boolean) => {
        const href = this.getUrl(data, modificable);
        return new Promise((resolve, reject) => {
            this.qrcode.toDataURL(href, { errorCorrectionLevel: 'Q' })
                .then((url: any) => {
                    resolve(url);
                })
                .catch((err: any) => {
                    reject(err);
                })
        });
    }

    getUrl(data: any, modificable: boolean): string {
        let href = window.location.href;
        if (!modificable) {
            href = href.replace('create', 'play');
        }
        const base64 = Base64.encode(JSON.stringify(data));
        href = href + '?session=' + base64;
        return href;
    }
}

