import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
  })
export class HeaderNameService {

    setTitle(url: any){
        
        url = url.replace(/\/\d{1,2}$/, '');
        
        switch(url){
            case '/dashboard': { 
                return 'DASHBOARD' 
             } 
            case '/ip': { 
                return 'IP' 
             } 
             case '/ftth': {
                    return 'FTTH'
             } 
             case '/rtr': { 
                return 'ROUTER'
         }
            case '/reportes': {
                return 'REPORTES'
            } 
             default: { 
                return 'Reico';
            } 
        }
    }
}