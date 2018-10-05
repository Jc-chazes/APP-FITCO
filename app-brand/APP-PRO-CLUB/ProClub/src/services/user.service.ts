import {Injectable} from '@angular/core';
import {AppService} from "./app.service";
import {AuthService} from "./auth.service";

@Injectable()
export class UserService {

    userDataToCreate: any;
    photoUser: any;

    constructor(
        private appService: AppService,
        private authService: AuthService){}

    getUser(){
        let userId = this.authService.userId;
        let url = this.appService.gateway + '/api/user-establishment/' + userId;
        return this.authService.get(url);
    }

    updateUser(user){
        let url = this.appService.gateway + '/api/user-establishment/' + user.id;
        return this.authService.put(url,user);
    }

    updatePhoto(photob64){
        let base64Image = photob64;
        let userId = this.authService.userId;
        const url = this.appService.gateway + '/api/user-establishment/uploadImage';
        let data = {
            photo: base64Image,
            userId: userId
        };
        return this.authService.post(url, data);
    }

    changePassword(data){
        let userId = this.authService.userId;
        let url = this.appService.gateway + '/api/users/'+userId+'/update-password';
        return this.authService.post(url,data);
    }

    createFinalUser(data){
        let url = this.appService.gateway + '/auth/add-user-stablishment';
        return this.authService.post(url,data);
    }

    createUser(data){
        let url = this.appService.gateway + '/api/users';
        return this.authService.post(url,data);
    }

    createUserEstablishment(data){
        let url = this.appService.gateway + '/api/user-establishment/';
        return this.authService.post(url,data);
    }

    deletePhoto(userEstablishmentId) {
        const urlDeletePhoto = `${this.appService.gateway}/api/user-establishment/delete-photo/${userEstablishmentId}`;
        const data = {userEstablishmentId: userEstablishmentId};
        return this.authService.put(urlDeletePhoto, data);
    }

}