import {Component} from '@angular/core';
import {NavController, Events, AlertController, LoadingController, Loading} from 'ionic-angular';
import {PayUService} from "../../services/payu.service";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {ValidationService} from "../../services/validation.service";
import {ProductsService} from "../../services/products.service";
import * as moment from "moment";

@Component({
    selector: 'page-form-card-data',
    templateUrl: 'form-card-data.html'
})
export class FormCardDataPage {

    loading: Loading;
    plan: any = {};
    currentDate = moment().format('YYYY-MM-DD');
    usePayU: boolean;
    errors: any = {};
    currency: string;
    product: any = {};
    card = {
        number : "",
        expDate : "",
        cvv : "",
    };
    submitted: boolean = false;

    constructor(
        public events: Events,
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        private payuService: PayUService,
        public ga: GoogleAnalytics,
        private validationService: ValidationService,
        private productsService: ProductsService) {
        this.currency = localStorage.getItem('currencyCode');
    }

    ionViewDidEnter(){
        this.submitted = false;
        this.ga.startTrackerWithId('UA-76827860-10')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('formCardDataPage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    ionViewWillEnter(){
        this.plan = {};
        this.product = {};
        this.submitted = false;

        if (this.payuService.planData) {
            this.plan = this.payuService.planData;
        }

        if (this.productsService.productToBuy) {
            this.product = this.productsService.productToBuy;
        }
    }

    validateDataPayu(){
        this.errors = [];
        this.errors.cardLuhn = !this.validationService.validCreditCardLuhn(this.card.number);
        this.errors.expDate = !this.validationService.validExpDateCard(this.card.expDate);
        this.errors.typeCard = !this.validationService.validNumberAndTypeCard(this.card.number, this.payuService.requestData.card.paymentMethod);
        this.errors.securityCode = !this.validationService.validCardCVV(this.card.cvv, this.payuService.requestData.card.paymentMethod);

        for (const err in this.errors) {
            if (this.errors[err]) {
                return false;
            }
        }

        return true;
    }

    startPayment(){
        if (!this.submitted) {
            this.submitted = true;

            if(this.validateDataPayu()){
                this.showLoading();
                let service;
                if (this.plan.name) {
                    service = this.payuService.createTransaction(this.plan, this.card);
                } else if (this.product.title) {
                    service = this.payuService.createProductTransaction(this.product, this.card);
                }
                service.subscribe(
                    (success:any) => {
                        if (success.title) {
                            this.showSuccess();
                        } else {
                            this.submitted = false;
                            if (success.code ===  'ERROR') {
                                this.showAlert(success.code,success.error);
                            } else if ( success.transactionResponse.state === 'DECLINED' ||
                                success.transactionResponse.state === 'REJECTED' ||
                                success.transactionResponse.state === 'ERROR' ||
                                success.transactionResponse.state === 'SUBMITTED' ||
                                success.transactionResponse.state === 'PENDING') {
                                let msg = '';
                                switch (success.transactionResponse.responseCode) {
                                    case 'ERROR':
                                        msg = 'Ocurrió un error general';
                                        break;
                                    case 'ANTIFRAUD_REJECTED':
                                        msg = 'La transacción fue rechazada por el sistema anti-fraude';
                                        break;
                                    case 'PAYMENT_NETWORK_REJECTED':
                                        msg = 'La red financiera rechazó la transacción.';
                                        break;
                                    case 'ENTITY_DECLINED':
                                        msg = 'La transacción fue declinada por el banco o por la red financiera debido a un error.';
                                        break;
                                    case 'INTERNAL_PAYMENT_PROVIDER_ERROR':
                                        msg = 'Ocurrió un error en el sistema intentando procesar el pago.';
                                        break;
                                    case 'INACTIVE_PAYMENT_PROVIDER':
                                        msg = 'El proveedor de pagos no se encontraba activo.';
                                        break;
                                    case 'DIGITAL_CERTIFICATE_NOT_FOUND':
                                        msg = 'La red financiera reportó un error en la autenticación.';
                                        break;
                                    case 'INSUFFICIENT_FUNDS':
                                        msg = 'La cuenta no tenía fondos suficientes.';
                                        break;
                                    case 'CREDIT_CARD_NOT_AUTHORIZED_FOR_INTERNET_TRANSACTIONS':
                                        msg = 'La tarjeta de crédito no estaba autorizada para transacciones por Internet.';
                                        break;
                                    case 'INVALID_TRANSACTION':
                                        msg = 'La red financiera reportó que la transacción fue inválida.';
                                        break;
                                    case 'INVALID_CARD':
                                        msg = 'La tarjeta es inválida.';
                                        break;
                                    case 'EXPIRED_CARD':
                                        msg = 'La tarjeta ya expiró.';
                                        break;
                                    case 'RESTRICTED_CARD':
                                        msg = 'La tarjeta presenta una restricción.';
                                        break;
                                    case 'CONTACT_THE_ENTITY':
                                        msg = 'Debe contactar al banco.';
                                        break;
                                    case 'REPEAT_TRANSACTION':
                                        msg = 'Se debe repetir la transacción.';
                                        break;
                                    case 'ENTITY_MESSAGING_ERROR':
                                        msg = 'La red financiera reportó un error de comunicaciones con el banco.';
                                        break;
                                    case 'BANK_UNREACHABLE':
                                        msg = 'El banco no se encontraba disponible.';
                                        break;
                                    case 'EXCEEDED_AMOUNT':
                                        msg = 'La transacción excede un monto establecido por el banco.';
                                        break;
                                    case 'NOT_ACCEPTED_TRANSACTION':
                                        msg = 'La transacción no fue aceptada por el banco por algún motivo.';
                                        break;
                                    case 'ERROR_CONVERTING_TRANSACTION_AMOUNTS':
                                        msg = 'Ocurrió un error convirtiendo los montos a la moneda de pago.';
                                        break;
                                    case 'EXPIRED_TRANSACTION':
                                        msg = 'La transacción expiró.';
                                        break;
                                    case 'PENDING_TRANSACTION_REVIEW':
                                        msg = 'La transacción fue detenida y debe ser revisada, esto puede ocurrir por filtros de seguridad.';
                                        break;
                                    case 'PENDING_TRANSACTION_CONFIRMATION':
                                        msg = 'La transacción está pendiente de ser confirmada.';
                                        break;
                                    case 'PAYMENT_NETWORK_BAD_RESPONSE':
                                        msg = 'El mensaje retornado por la red financiera es inconsistente.';
                                        break;
                                    case 'PAYMENT_NETWORK_NO_CONNECTION':
                                        msg = 'No se pudo realizar la conexión con la red financiera.';
                                        break;
                                    case 'PAYMENT_NETWORK_NO_RESPONSE':
                                        msg = 'La red financiera no respondió.';
                                        break;
                                    case 'FIX_NOT_REQUIRED':
                                        msg = 'Clínica de transacciones: Código de manejo interno.';
                                        break;
                                    default:
                                        msg = 'Ocurrió un error general';
                                        break;
                                }
                                this.showAlert(success.transactionResponse.responseCode, msg);
                            }
                        }
                    },
                    error =>{
                        this.loading.dismiss();
                        let alert = this.alertCtrl.create({
                            title: `<img src="assets/images/sad-face.png" class="icon-booking"> <h6 class="title-booking">No se pudo realizar la transacción</h6>`,
                            message: 'Por favor comunicate con tu centro deportivo',
                            buttons: [{text: 'Ok'}]
                        });
                        alert.present();
                        this.submitted = false;
                    }
                );
            } else {
                this.submitted = false;
            }
        }
    }

    showSuccess(){
        this.loading.dismiss();
        const congratulations = this.alertCtrl.create({
            title: `<img src="assets/images/success.png" class="icon-booking"> <h6 class="title-booking">`+'¡HURRA!'+`</h6>`,
            message: 'Tu compra se realizó satisfactoriamente',
            buttons: [{
                text: 'Ok',
                handler: () => {
                    //this.events.publish('gototab');
                    /*this.navCtrl.popToRoot(ShopPage);*/
                    this.navCtrl.popToRoot();
                }
            }]
        });
        congratulations.present();
    }

    showAlert(title, message){
        this.loading.dismiss();
        const alert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: ['Ok']
        });
        alert.present();
    }

    showLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Un momento...',
            enableBackdropDismiss: false
        });
        this.loading.present();
    }

}
