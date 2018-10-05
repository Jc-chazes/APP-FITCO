import {Injectable} from '@angular/core';
import {AppService} from "./app.service";
import {AuthService} from "./auth.service";

@Injectable()
export class AttendancesService {

    constructor(
        private appService: AppService,
        private authService: AuthService){}

    getAttendancesByMembership(membershipId){
        let url = this.appService.gateway + '/api/memberships/'+membershipId+'/lessons';
        return this.authService.get(url);
    }

}