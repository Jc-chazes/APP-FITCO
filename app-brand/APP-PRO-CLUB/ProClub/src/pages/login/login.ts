import {Component} from '@angular/core';
import {NavController, Loading, LoadingController, AlertController} from 'ionic-angular';
import {TabsPage} from "../tabs/tabs";
import {AuthService} from "../../services/auth.service";
import {EstablishmentsService} from "../../services/establishments.service";
import {CentersPreviewPage} from "../centers-preview/centers-preview";
import {SignupPage} from "../signup/signup";
import {AppService} from "../../services/app.service";
import {GoogleAnalytics} from '@ionic-native/google-analytics';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    loading: Loading;
    user : any = {
        email : "",
        password: ""
    };

    constructor(
        public navCtrl: NavController,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private authService: AuthService,
        private appService: AppService,
        private establishmentService: EstablishmentsService,
        public ga: GoogleAnalytics) {}

    ionViewDidEnter(){
        this.ga.startTrackerWithId('UA-76827860-10')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('loginPage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    validateLogin(){
        const regexEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if(this.user.email == "" || this.user.password == ""){
            let alert = this.alertCtrl.create({
                title: `<img src="assets/images/sad-face.png" class="icon-booking"> <h6 class="title-booking">`+'Uy...'+`</h6>`,
                message: 'Por favor completa los campos',
                buttons: ['OK']
            });
            alert.present();
        }
        else if(!regexEmail.test(this.user.email)){
            let alert = this.alertCtrl.create({
                title: `<img src="assets/images/sad-face.png" class="icon-booking"> <h6 class="title-booking">`+'Uy...'+`</h6>`,
                message: 'Por favor ingresa un correo electrónico válido',
                buttons: ['OK']
            });
            alert.present();
        }
        else{
            this.showLoading();
            this.authService.login(this.user)
                .subscribe(
                    (success: any) =>{
                        this.loading.dismiss();

                        if(success.data.length > 0){
                            localStorage.setItem('id_token', success.token);
                            localStorage.setItem('QR', success.data[0].QRApp);
                            let arrEstablishments = [];

                            for(let elem of success.data){
                                const arrIds = this.appService.arrEstablishmentIds;

                                console.log('index of => ', arrIds.indexOf(elem.establishmentId), elem.establishmentId);
                                if (arrIds.indexOf(elem.establishmentId) != -1) {
                                    arrEstablishments.push(elem);
                                }
                            }

                            if (arrEstablishments.length == 0) {
                                let alert = this.alertCtrl.create({
                                    title: `<img src="assets/images/sad-face.png" class="icon-booking"> <h6 class="title-booking">`+'Ups...'+`</h6>`,
                                    message: 'Tu usuario no pertenece a este centro.',
                                    buttons: ['OK']
                                });
                                alert.present();

                            } else if(arrEstablishments.length == 1) {
                            
                                localStorage.setItem('userLogged',JSON.stringify(arrEstablishments[0]));
                                localStorage.setItem('establishmentSelected', arrEstablishments[0].establishmentId);
                                localStorage.setItem('statusPhysicalConditionsRegister', arrEstablishments[0].statusPhysicalConditionsRegister);
                                localStorage.setItem('statusSchedule', arrEstablishments[0].statusSchedule);
                                localStorage.setItem('statusWaitingList', arrEstablishments[0].statusWaitingList);
                                localStorage.setItem('statusUploadPhotoProgress', arrEstablishments[0].statusUploadPhotoProgress);
                                localStorage.setItem('statusRatingLessons', arrEstablishments[0].statusRatingLessons);
                                localStorage.setItem('statusShareBD', arrEstablishments[0].shareBd);
                                localStorage.setItem('orgEstablishments', arrEstablishments[0].orgEstablishments);
                                localStorage.setItem('QR', arrEstablishments[0].QRApp);
                                localStorage.setItem('statusLimitMembershipTest', arrEstablishments[0].statusLimitMembershipTest);

                                this.authService.userLogged = arrEstablishments[0];
                                this.authService.establishmentId = arrEstablishments[0].establishmentId;
                                this.authService.userId = arrEstablishments[0].id;

                                this.ga.startTrackerWithId('UA-76827860-10')
                                    .then(() => {
                                        console.log('Google analytics is ready now');
                                        this.ga.trackEvent('Usuario', 'inicia sesión', this.authService.userLogged.establishmentName  +' / '+ this.authService.establishmentId);
                                    })
                                    .catch(e => console.log('Error starting GoogleAnalytics', e));

                                this.navCtrl.setRoot(TabsPage);

                            } else if (arrEstablishments.length > 1) {
                                this.establishmentService.establishmentsByUser = arrEstablishments;
                                this.navCtrl.push(CentersPreviewPage);
                            }

                        } else if(success.data.length == 0){
                            let alert = this.alertCtrl.create({
                                title: `<img src="assets/images/sad-face.png" class="icon-booking"> <h6 class="title-booking">`+'Ups...'+`</h6>`,
                                message: 'Tu usuario no está asociado a tu centro.',
                                buttons: ['OK']
                            });
                            alert.present();
                        }
                    },
                    error=>{
                        this.loading.dismiss();
                        let err = error.error;
                        let message = "";

                        switch (err.title) {
                            case "ERROR_DB_BODY":
                                message = "Error de conexión";
                                break;
                            case "USER_NO_FOUND":
                                message = "Verifica tus datos por favor";
                                break;
                            case "CLIENTES.ALERTAS.USER_NO_FOUND":
                                message = "Usuario no encontrado";
                                break;
                        }

                        let alert = this.alertCtrl.create({
                            title: `<img src="assets/images/sad-face.png" class="icon-booking"> <h6 class="title-booking">`+'Ups...'+`</h6>`,
                            message: message,
                            buttons: ['OK']
                        });
                        alert.present();
                    }
                );
        }

    }

    showLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Un momento...',
            enableBackdropDismiss: false
        });
        this.loading.present();
    }

    goToSignUp(){
        this.navCtrl.push(SignupPage);
    }

}
