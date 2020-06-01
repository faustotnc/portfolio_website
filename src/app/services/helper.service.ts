import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Injectable()
export class HelperService {
    constructor(@Inject(PLATFORM_ID) private platform: object) { }


    /**
     * detect IE
     * returns version of IE or false if browser is not Internet Explorer
     */
    public isIEorEdge() {
        if (isPlatformBrowser(this.platform)) {
            const UserAgent = navigator.userAgent;

            const msie = UserAgent.indexOf('MSIE ');
            if (msie > 0) {
                // IE 10 or older => return version number
                return parseInt(UserAgent.substring(msie + 5, UserAgent.indexOf('.', msie)), 10);
            }

            const trident = UserAgent.indexOf('Trident/');
            if (trident > 0) {
                // IE 11 => return version number
                const rv = UserAgent.indexOf('rv:');
                return parseInt(UserAgent.substring(rv + 3, UserAgent.indexOf('.', rv)), 10);
            }

            const edge = UserAgent.indexOf('Edge/');
            if (edge > 0) {
                // Edge (IE 12+) => return version number
                return parseInt(UserAgent.substring(edge + 5, UserAgent.indexOf('.', edge)), 10);
            }

            // other browser
            return false;
        } else {
            return null;
        }
    }
}
