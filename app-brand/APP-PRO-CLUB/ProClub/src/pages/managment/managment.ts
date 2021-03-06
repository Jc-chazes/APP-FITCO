import {Component} from '@angular/core';
import {NavController, App, ActionSheetController} from 'ionic-angular';
import {MembershipsPage} from "../memberships/memberships";
import {ReservesPage} from "../reserves/reserves";
import {ProductsPage} from "../products/products";
import {UnpaidsPage} from "../unpaids/unpaids";
import {DebtsPage} from "../debts/debts";
import {SettingsPage} from "../settings/settings";
import {ProfilePage} from "../profile/profile";
import {TabsPage} from "../tabs/tabs";
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {EstablishmentsService} from "../../services/establishments.service";
import {QrCodePage} from "../qr-code/qr-code";

@Component({
    selector: 'page-managment',
    templateUrl: 'managment.html'
})
export class ManagmentPage {
    user : any;

    thereAreMoreEstablishments: boolean;
    listEstablishments: any[];
    buttonsEstablishments: any[];
    establishmentName: string;
    QR: boolean;
    constructor(
        public appCtrl: App,
        public ga: GoogleAnalytics,
        public navCtrl: NavController,
        public actionsheetCtrl: ActionSheetController,
        private userService: UserService,
        private authService: AuthService,
        private establishmentsService: EstablishmentsService) {}

    ionViewDidEnter(){
        this.ga.startTrackerWithId('UA-76827860-10')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('managmentPage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }


    getDataUser(){
        this.userService.getUser()
            .subscribe(
                (success: any) =>{
                    this.user = success[0];
                    //SET PHOTO
                    if (this.user.photo === null || this.user.photo === "") {
                        this.user.photo = "assets/images/user.png";
                    }
                    else {
                        this.user.photo = this.user.photo + '?r='+ Math.random();
                    }
                },
                error =>{
                    console.log('ERROR', error);
                }
            );
        this.establishmentName = this.authService.userLogged.establishmentName;
    }

    getEstablishments(){
        this.buttonsEstablishments = [];
        this.thereAreMoreEstablishments = false;
    }

    ionViewWillEnter(){
        this.QR = localStorage.getItem('QR') == 'Y' ? true : false;
        this.getDataUser();
        this.getEstablishments();
    }

    viewSettings(){
        this.navCtrl.push(SettingsPage);
    }

    viewProfile(){
        this.navCtrl.push(ProfilePage);
    }

    goToMemberships(){
        this.navCtrl.push(MembershipsPage);
    }

    goToReserves(){
        this.navCtrl.push(ReservesPage);
    }

    goToProducts(){
        this.navCtrl.push(ProductsPage);
    }

    goToUnpaids(){
        this.navCtrl.push(UnpaidsPage);
    }

    goToDebts(){
        this.navCtrl.push(DebtsPage);
    }

    goToQrCode(){
        this.navCtrl.push(QrCodePage);
    }

    showEstablishments(){
        let actionSheet = this.actionsheetCtrl.create({
            title: 'Ir a otro centro fitness',
            buttons: this.buttonsEstablishments
        });
        actionSheet.present();
    }

    changeEstablishment(establishment){
        this.establishmentsService.selectedEstablishmentId = establishment.establishmentId;

        this.authService.userId = establishment.id;
        this.authService.userLogged = establishment;
        this.authService.establishmentId = establishment.establishmentId;
        this.authService.statusPhysicalConditionsRegister = establishment.statusPhysicalConditionsRegister;
        this.authService.statusSchedule = establishment.statusSchedule;

        localStorage.setItem('userLogged',JSON.stringify(establishment));
        localStorage.setItem('establishmentSelected',establishment.establishmentId);
        localStorage.setItem('statusPhysicalConditionsRegister', establishment.statusPhysicalConditionsRegister);
        localStorage.setItem('statusSchedule', establishment.statusSchedule);
        localStorage.setItem('statusWaitingList', establishment.statusWaitingList);
        localStorage.setItem('statusUploadPhotoProgress', establishment.statusUploadPhotoProgress);
        localStorage.setItem('statusRatingLessons', establishment.statusRatingLessons);
        localStorage.setItem('statusShareBD', establishment.shareBd);
        localStorage.setItem('orgEstablishments', establishment.orgEstablishments);
        localStorage.setItem('QR', establishment.QRApp);
        localStorage.setItem('statusLimitMembershipTest', establishment.statusLimitMembershipTest);
        this.appCtrl.getRootNav().setRoot(TabsPage);
    }
}
