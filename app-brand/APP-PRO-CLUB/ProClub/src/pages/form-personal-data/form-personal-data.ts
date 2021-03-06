import {Component} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import {FormCardDataPage} from "../form-card-data/form-card-data";
import {PayUService} from "../../services/payu.service";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {PlansService} from "../../services/plans.service";
import {AuthService} from "../../services/auth.service";
import {ValidationService} from "../../services/validation.service";

@Component({
    selector: 'page-form-personal-data',
    templateUrl: 'form-personal-data.html'
})
export class FormPersonalDataPage {

    user: any = {
        name : '',
        lastName : '',
        email : '',
        celPhone : '',
        dni: '',
        birthdate: ''
    };
    errors: any = {};
    choosedCard: '';

    constructor(
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        private payuService: PayUService,
        public ga: GoogleAnalytics,
        private plansService: PlansService,
        private authService: AuthService,
        private validationService: ValidationService) {}

    ionViewDidEnter(){
        this.ga.startTrackerWithId('UA-76827860-10')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('formPersonalDataPage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    ionViewWillEnter(){
        this.choosedCard = '';
    }

    /*Market Payu*/
    validateDataPayu(){
        this.errors = [];
        this.errors.name = !this.validationService.validString(this.user.name);
        this.errors.lastName = !this.validationService.validString(this.user.lastName);
        this.errors.email = !this.validationService.validEmail(this.user.email);
        this.errors.celPhone = !this.validationService.validString(this.user.celPhone);
        this.errors.dni = !this.validationService.validString(this.user.dni);
        this.errors.choosedCard = !this.validationService.validString(this.choosedCard);
        this.errors.birthdate = !this.validationService.validString(this.user.birthdate);

        for (const err in this.errors) {
            if (this.errors[err]) {
                return false;
            }
        }

        return true;
    }

    showFormCardData(){
        if(!this.validateDataPayu()){
            let alert = this.alertCtrl.create({
                title: 'Ups...',
                message: 'Por favor completa correctamente todos los campos',
                buttons: ['Ok']
            });
            alert.present();
        }
        else{
            this.payuService.getIP();
            this.payuService.requestData.user.name = this.user.name;
            this.payuService.requestData.user.lastName = this.user.lastName;
            this.payuService.requestData.user.email = this.user.email;
            this.payuService.requestData.user.celPhone = this.user.celPhone;
            this.payuService.requestData.user.dni = this.user.dni;
            this.payuService.requestData.user.birthdate = this.user.birthdate;
            this.payuService.requestData.card.paymentMethod = this.choosedCard;
            this.payuService.requestData.card.name = this.user.name + ' ' + this.user.lastName;

            this.ga.startTrackerWithId('UA-76827860-10')
                .then(() => {
                    console.log('Google analytics is ready now');
                    this.ga.trackEvent('Market', 'continuar', this.authService.userLogged.establishmentName+ ' / '+this.authService.establishmentId+' / '+this.plansService.planDetail.name, this.plansService.planDetail.price);
                })
                .catch(e => console.log('Error starting GoogleAnalytics', e));

            this.navCtrl.push(FormCardDataPage);
        }
    }

}
