import { Injectable } from '@angular/core';

@Injectable()
export class AppService {
//  gateway = "https://nodejs.fitcoapp.net";
 gateway= "https://172.16.17.49:9000";
 arrEstablishmentIds = [4];

 // arrEstablishmentIDs = 354
 arrCompletEestablishments: any = [
    {
        name: 'Demo',
        id: 93
    },
    {
        name: 'Otro centro',
        id: 92  
    }
];
}