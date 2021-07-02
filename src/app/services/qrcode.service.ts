import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class QrcodeService {
    qrcode = require('qrcode');

    constructor() { }

    convertURLtoQR = (data: any) => {
        const href = this.getUrl(data);
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

    getUrl(data: any): string {
        let href = window.location.href;
        const base64 = window.btoa(JSON.stringify(data));
        href = href + '?session=' + base64;
        return href;
    }
}

