import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
  })
export class HeaderNameService {

    setTitle(url: any){
        
        url = url.replace(/\/\d{1,2}$/, '');
        
        switch(url){
            case '/ip': { 
                return 'IP' 
             } 
             case '/fttch': {
                    return 'FTTCH'
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