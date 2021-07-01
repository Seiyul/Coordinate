import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class QrcodeService {
    qrcode = require('qrcode');

    constructor() { }

    convertURLtoQR = (data: any) => {
        let href = window.location.href;
        const base64 = window.btoa(JSON.stringify(data));
        href = href + '?session=' + base64;

        console.log('href -->', href);


        return new Promise((resolve, reject) => {
            this.qrcode.toDataURL(href)
                .then((url: any) => {
                    resolve(url);
                })
                .catch((err: any) => {
                    reject(err);
                })
        });
    }
}

