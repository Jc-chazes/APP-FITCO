import {Injectable} from '@angular/core';
import {AppService} from "./app.service";
import {AuthService} from "./auth.service";

@Injectable()
export class FreezesService {

    constructor(
        private appService: AppService,
        private authService: AuthService){}

    getFreezesByMembership(membershipId){
        let url = this.appService.gateway + '/api/memberships/'+membershipId+'/freezes';
        return this.authService.get(url);
    }

}