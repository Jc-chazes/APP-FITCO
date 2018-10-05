import {Injectable} from '@angular/core';
import {AppService} from "./app.service";
import {AuthService} from "./auth.service";

@Injectable()
export class MembershipsService {

    membershipDetail : any;

    constructor(
        private appService: AppService,
        private authService: AuthService){}

    getMemberships(){
        let userId = this.authService.userId;
        let url = this.appService.gateway + '/api/memberships/' +userId+ '/by-user?orderby=id&status=ALL';

        return this.authService.get(url);
    }

    createMembership(membership){
        let url = this.appService.gateway + '/api/memberships';

        return this.authService.post(url, membership);
    }

    buyMembership(membership){
        let url = this.appService.gateway + '/api/memberships/add-membership-payment-byapp';

        return this.authService.post(url, membership);
    }

}