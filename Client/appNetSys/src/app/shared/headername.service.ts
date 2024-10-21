import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderNameService {
  setTitle(url: any) {
    url = url.replace(/\/\d{1,2}$/, '');

    switch (url) {
      case '/olt': {
        return 'OLT';
      }
      case '/ftth': {
        return 'FTTH';
      }
      case '/iptv': {
        return 'IPTV';
      }
      case '/ont': {
        return 'ONT';
      }
      case '/rtr': {
        return 'ROUTER';
      }
      default: {
        return 'Reico';
      }
    }
  }
}
