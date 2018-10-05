import {Injectable} from '@angular/core';
import {AppService} from "./app.service";
import {AuthService} from "./auth.service";

@Injectable()
export class DisciplinesService {

    constructor(
        private appService: AppService,
        private authService: AuthService){}

    getDisciplines(establishmentFilter?){
        let establishmentId = establishmentFilter ? establishmentFilter : this.authService.establishmentId;
        establishmentId = localStorage.getItem("statusShareBD") === 'Y' ? localStorage.getItem("orgEstablishments") : establishmentId;
        let url = this.appService.gateway + '/api/disciplines/' +establishmentId+ '/by-establishment?cbp=ALL&status=1';

        return this.authService.get(url);
    }

    getDisciplinesByMembership(membershipId){
        let url = this.appService.gateway + '/api/disciplines/'+membershipId+'/by-plans';
        return this.authService.get(url);
    }
}
