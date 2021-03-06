import {Injectable} from '@angular/core';
import {AppService} from "./app.service";
import {AuthService} from "./auth.service";

@Injectable()
export class PlansService {

    planDetail : any;

    constructor(
        private appService: AppService,
        private authService: AuthService){}


    getOnlinePlans(){
        let establishmentId = this.authService.establishmentId;
        let url = this.appService.gateway + '/api/plans/'+establishmentId+'/by-establishment?cbp=all&typePlan=2';
        return this.authService.get(url);
    }

    public getAvailablePlansForUser() {
      let establishmentId = this.authService.establishmentId;
      const userId = JSON.parse(localStorage.getItem('userLogged')).id;
      const urlPlans = `${this.appService.gateway}/api/plans/${establishmentId}/valid-test?userId=${userId}`;
      return this.authService.get(urlPlans);

    }

}
