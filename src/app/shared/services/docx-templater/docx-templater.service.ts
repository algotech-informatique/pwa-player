import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import XlsxModule from 'docxtemplater-xlsx-module';
import ImageModule from 'docxtemplater-image-module';

@Injectable({
    providedIn: 'root'
})
export class DocxTemplaterService {

    constructor() { }

    xlsxModule(): any {
        const xlsxOpts = {
            fmts: {
                float: '0.0',
                currency: '#,##0.00 [$€-407];[RED]-#,##0.00 [$€-407]',
                date: 'DD/MM/YYYY',
                percent: '0.0%',
            },
        };
        return new XlsxModule(xlsxOpts);
    }

    imageModule(): any {
        return new ImageModule({
            getImage: (tag) => {
                const base64DataURLToArrayBuffer = (dataURL) => {
                    const base64Regex = /^data:image\/(png|jpg|jpeg|svg|svg\+xml);base64,/;
                    if (!base64Regex.test(dataURL)) {
                        return null;
                    }
                    const stringBase64 = dataURL.replace(base64Regex, '');
                    let binaryString;
                    if (typeof window !== 'undefined') {
                        binaryString = window.atob(stringBase64);
                    } else {
                        throw new Error('error when parse base64');
                    }
                    const len = binaryString.length;
                    const bytes = new Uint8Array(len);
                    for (let i = 0; i < len; i++) {
                        const ascii = binaryString.charCodeAt(i);
                        bytes[i] = ascii;
                    }
                    return bytes.buffer;
                };
                return base64DataURLToArrayBuffer(((tag.size || tag.maxSize) && tag.data) ? tag.data : tag);
            },
            getSize: (img, tag) => new Promise((resolve, reject) => {
                    if (tag.size && tag.data) {
                        resolve(tag.size);
                    }

                    const i = new Image();

                    i.onload = () => {
                        const width = i.width;
                        const height = i.height;

                        if (!tag || !tag.maxSize) {
                            resolve([width, height]);
                        } else {

                            const maxWidth = tag.maxSize[0];
                            const maxHeight = tag.maxSize[1];


                            const widthRatio = width / maxWidth;
                            const heightRatio = height / maxHeight;
                            if (widthRatio < 1 && heightRatio < 1) {
                                resolve([width, height]);
                            }

                            let finalWidth;
                            let finalHeight;
                            if (widthRatio > heightRatio) {
                                finalWidth = maxWidth;
                                finalHeight = height / widthRatio;
                            }
                            else {
                                finalHeight = maxHeight;
                                finalWidth = width / heightRatio;
                            }

                            resolve([
                                Math.round(finalWidth),
                                Math.round(finalHeight)
                            ]);
                        }

                    };
                    i.onerror = ((err) => reject(err));
                    i.src = (tag.data) ? tag.data : tag;
                })
        });
    }

    modules() {
        return [this.xlsxModule(), this.imageModule()];
    }
}
