import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppService} from "./app.service";

@Injectable()
export class AuthService {

    public userLogged : any;
    public establishmentId: number;
    public userId: number;
    public statusPhysicalConditionsRegister: string;
    public statusSchedule: string;

    constructor(
        private http : HttpClient,
        private appService: AppService
    ){}

    public login(user){
        let auth = {
            email: user.email,
            password: user.password
        };

        let url = this.appService.gateway + '/auth/app';
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.post(url, auth, {headers: headers});
    }

    public logout(){
        localStorage.clear();
    }

    public get(url){
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json',
                'Authorization': localStorage.getItem('id_token') ? localStorage.getItem('id_token') : ""
            })
        }
        return this.http.get(url, httpOptions);
    }

    public post(url, data){
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json',
                'Authorization': localStorage.getItem('id_token') ? localStorage.getItem('id_token') : ""
            })
        }
        return this.http.post(url, data, httpOptions);
    }

    public put(url, data){
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json',
                'Authorization': localStorage.getItem('id_token') ? localStorage.getItem('id_token') : ""
            })
        }
        return this.http.put(url, data, httpOptions);
    }

    public delete(url){
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json',
                'Authorization': localStorage.getItem('id_token') ? localStorage.getItem('id_token') : ""
            })
        }

        return this.http.delete(url, httpOptions);
    }

    public vaff() {
        let token = localStorage.getItem('id_token') ? localStorage.getItem('id_token') : "";
        let url = this.appService.gateway + "/api/users/hjkaaavdk/thptxytyj";
        let data = { msg: "#fw/$^8*eihf7732e"};
        let headers = new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': token
        });
        return this.http.post(url, data, {headers:headers});
    }

    public verifyStatus(data) {
        let url = this.appService.gateway + '/auth/app-verify-status';
        let token = localStorage.getItem('id_token') ? localStorage.getItem('id_token') : "";
        let headers = new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': token
        });

        return this.http.post(url, data, {headers:headers});
    }

}