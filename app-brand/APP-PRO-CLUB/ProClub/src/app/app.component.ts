import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
/**/
import {LoginPage} from "../pages/login/login";
import {TabsPage} from "../pages/tabs/tabs";
import {AuthService} from "../services/auth.service";
import {EstablishmentsService} from "../services/establishments.service";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {Push} from "@ionic-native/push";
declare var FCMPlugin: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoginPage;

    constructor(
      public platform: Platform,
      public statusBar: StatusBar,
      public splashScreen: SplashScreen,
      public push: Push,
      public alert: AlertController,
      public authService: AuthService,
      public establishmentService: EstablishmentsService,
      public ga: GoogleAnalytics) {

      platform.ready().then(() => {
          // Okay, so the platform is ready and our plugins are available.
          // Here you can do any higher level native things you might need.
          statusBar.styleDefault();
          splashScreen.hide();

      });

      this.vFHJ();
      this.validateSession();
      this.pushsetup();
    }

    validateSession(){
      let token = localStorage.getItem('id_token');
      let userSaved = localStorage.getItem('userLogged');

      if(token && userSaved){
        this.authService.userLogged = JSON.parse(userSaved);
        this.authService.userId = this.authService.userLogged.id;
        this.authService.establishmentId = this.authService.userLogged.establishmentId;

        this.establishmentService.establishmentsByUser = JSON.parse(localStorage.getItem('userEstablishments'));
        this.establishmentService.selectedEstablishmentId = localStorage.getItem('establishmentSelected');

        this.rootPage = TabsPage;
        this.verifyUser(this.authService.userLogged.email, this.authService.establishmentId);
      }
      else{
          this.rootPage = LoginPage;
      }
    }

    pushsetup() {
      if (typeof (FCMPlugin) != 'undefined') {
        FCMPlugin.onNotification(function (data) {
            console.log("\n", data, "\n hola \n");
            if (data.wasTapped) {
                console.log(data);
                //Notification was received on device tray and tapped by the user.
                alert(JSON.stringify(data));
            } else {
                //Notification was received in foreground. Maybe the user needs to be notified.
                alert(JSON.stringify(data));
            }
        });
      }
    }

    vFHJ() {
      this.authService.vaff().subscribe(
          response => {}, 
          (err: any) =>{
            let erro = err.error;
            if (erro.msg === '4f89wef41ef8w118wef') {
                if(localStorage.getItem('userLogged') != undefined || localStorage.getItem('userLogged') != null){
                    this.authService.logout();
                }
            }
            else if (erro.msg === '748jfe7wefd5585d2') {
                if(localStorage.getItem('userLogged') != undefined || localStorage.getItem('userLogged') != null){
                    this.authService.logout();
                }
            }
          });
    }

    verifyUser(email, establishmentId) {
      this.authService.verifyStatus({email, establishmentId})
          .subscribe(
              (success: any) => {
                if(success.data[0].statusApp == 'N') {
                  this.authService.logout();
                  this.rootPage = LoginPage;
                } else {
                  this.authService.statusPhysicalConditionsRegister =  success.data[0].statusPhysicalConditionsRegister;
                  this.authService.statusSchedule = success.data[0].statusSchedule;

                  localStorage.setItem('statusPhysicalConditionsRegister', success.data[0].statusPhysicalConditionsRegister);
                  localStorage.setItem('statusSchedule', success.data[0].statusSchedule);
                  localStorage.setItem('statusWaitingList', success.data[0].statusWaitingList);
                  localStorage.setItem('statusUploadPhotoProgress', success.data[0].statusUploadPhotoProgress);
                  localStorage.setItem('statusRatingLessons', success.data[0].statusRatingLessons);
                  localStorage.setItem('statusShareBD', success.data[0].shareBd);
                  localStorage.setItem('orgEstablishments', success.data[0].orgEstablishments);
                  localStorage.setItem('QR', success.data[0].QRApp);
                  localStorage.setItem('statusLimitMembershipTest', success.data[0].statusLimitMembershipTest);
                  this.ga.startTrackerWithId('UA-76827860-10')
                      .then(() => {
                          console.log('Google analytics is ready now');
                          this.ga.trackEvent('Usuario', 'recurrente', this.authService.userLogged.establishmentName + ' / ' + this.authService.establishmentId);
                      })
                      .catch(e => console.log('Error starting GoogleAnalytics', e));
                }
              },
              (error: any) => {
                let err = error.error;
                if(err.title == 'USER_NO_FOUND') {
                  this.authService.logout();
                  this.rootPage = LoginPage;
                }
              }
          );
    }
}
