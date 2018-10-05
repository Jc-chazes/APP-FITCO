import {Component} from '@angular/core';
import {NavController, Loading, LoadingController, AlertController} from 'ionic-angular';
import {UserService} from "../../services/user.service";
import {EstablishmentsService} from "../../services/establishments.service";
import {AuthService} from "../../services/auth.service";
import {CentersPreviewPage} from "../centers-preview/centers-preview";
import {OnboardingPage} from "../onboarding/onboarding";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {AppService} from "../../services/app.service";

@Component({
    selector: 'page-searcher',
    templateUrl: 'searcher.html'
})
export class SearcherPage {

    establishments: any;
    loading: Loading;

    constructor(
        public ga: GoogleAnalytics,
        public navCtrl: NavController,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private authService: AuthService,
        private userService: UserService,
        private appService: AppService,
        private establishmentService: EstablishmentsService) {}

    ionViewDidEnter(){
        this.ga.startTrackerWithId('UA-76827860-10')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('searcherPage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    ionViewWillEnter(){
        this.establishments = this.appService.arrCompletEestablishments;
    }

    chooseEstablishment(establishment){
        this.showLoading();

        let newBody = {
            name: this.userService.userDataToCreate.name,
            lastName: this.userService.userDataToCreate.lastName,
            email: this.userService.userDataToCreate.email,
            password: this.userService.userDataToCreate.password,
            establishmentId: establishment.id,
            roleId: 5
        };

        this.userService.createFinalUser(newBody)
            .subscribe(
                response =>{
                    let user = {
                        email: this.userService.userDataToCreate.email,
                        password: this.userService.userDataToCreate.password
                    };

                    this.authService.login(user)
                        .subscribe(
                            (success: any) =>{
                                this.loading.dismiss();

                                if(success.data.length > 0){
                                    localStorage.setItem('id_token', success.token);

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

                                        this.navCtrl.setRoot(OnboardingPage);

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
                            (error: any) => {
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

                },
                error =>{
                    this.loading.dismiss();

                    let err = error.error;
                    let title = "";
                    let message = "";

                    switch (err.title) {
                        case "ERROR_DB_BODY":
                            title = `<img src="assets/images/sad-face.png" class="icon-booking"> <h6 class="title-booking">`+''+`</h6>`;
                            message = "Por favor verifica tu conexión a internet e intentalo nuevamente";
                            break;
                        case "CLIENTES.ERROR.USUARIO_DUPLICADO_TITULO":
                            title = `<img src="assets/images/icon-hand.png" class="icon-booking"> <h6 class="title-booking">`+'¡HOLA!'+`</h6>`;
                            message = "Ya te encuentras registrado en este establecimiento. Por favor contáctate con ellos y solicita tus accesos";
                            break;
                    }

                    let alert = this.alertCtrl.create({
                        title: title,
                        subTitle: message,
                        buttons: ['OK']
                    });
                    alert.present();
                }
            );
    }

    showLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Un momento...',
            enableBackdropDismiss: false
        });
        this.loading.present();
    }

}
