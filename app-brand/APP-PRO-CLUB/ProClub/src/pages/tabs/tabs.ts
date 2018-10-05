import {Component, ViewChild} from '@angular/core';
import { Tabs, Events } from 'ionic-angular';
import {SchedulePage} from "../schedule/schedule";
import {ShopPage} from "../shop/shop";
import {HomePage} from '../home/home';
import {NotificationsPage} from '../notifications/notifications';
import {ManagmentPage} from "../managment/managment";
// para el manejo de las notificaciones
declare var Pusher: any;
import {LocalNotifications} from '@ionic-native/local-notifications';
import {AuthService} from "./../../services/auth.service";
import {NavController} from 'ionic-angular';
import { DevicesService } from '../../services/devices.service';
import { Subscription } from 'rxjs/Subscription';
import { NavigationService } from '../../services/navigation.service';
import { AppStateService } from '../../services/app-state.service';

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    tab1Root = SchedulePage;
    tab2Root = ShopPage;
    tab3Root = HomePage;
    tab4Root = NotificationsPage;
    tab5Root = ManagmentPage;
    pusher: any;
    cont = 0;
    urlNotification = "";
    notificationCount = 0;
    appState: any;

    navigationSub: Subscription;
    get allowNotifications(): boolean{
      return localStorage.getItem('statusNotificationMobile') == 'Y' ? true : false;
    }
    @ViewChild("tabs") tabs: Tabs;

    @ViewChild("nametab") nametab: Tabs;

    constructor(private localNotifications: LocalNotifications,
        public navCtrl: NavController,
        public events: Events,
        private authService: AuthService,
        private appStateService: AppStateService,
        private devices: DevicesService,
        private navigation: NavigationService) {

        // this.notificationCount = localStorage.getItem('countNotification') == null ? 0 : parseInt(localStorage.getItem('countNotification'));
        // this.notificationManager();
        this.appStateService.onStateChange.subscribe( state => {
            this.notificationCount = state.notifications.unreadCount == 0 ? null : state.notifications.unreadCount;
          });
          this.appStateService.setState({
            notifications: {
              unreadCount: localStorage.getItem('unreadNotificationsCount')
          } });
          this.navigationSub = navigation.onNavigate.subscribe( tabIndex => {
              if(tabIndex != null){
                  this.tabs.select(tabIndex);
              }
          })
    }

    ionViewDidLoad(){
        this.devices.populate().subscribe();
        // this.events.subscribe('gototab', () => {
        //     this.nametab.select(2);
        // })
    }
    
    // notificationManager() {
    //     this.pusher = new Pusher('dbbd540cdd39aa8f015c', {
    //         cluster: 'us2',
    //         encrypted: true
    //     });
    //     let establishmentChanel = this.pusher.subscribe('establishment-' + this.authService.establishmentId);
    //     establishmentChanel.bind('notification', (dataIn) => {
    //         this.localNotifications.cancelAll().then(() => {
    //             this.localNotifications.schedule({
    //                 id: this.cont,
    //                 title: dataIn.title,
    //                 text: dataIn.text
    //             });
    //             this.cont = this.cont++;
    //         });
    //     });


    //     let userChanel = this.pusher.subscribe('user-' + this.authService.userId);
    //     userChanel.bind('notification', (dataIn) => {
    //         localStorage.setItem("countNotification", `${this.notificationCount + 1}`);
    //         this.notificationCount++;
    //         this.localNotifications.cancelAll().then(() => {
    //             this.localNotifications.schedule({
    //                 id: this.cont,
    //                 title: dataIn.title,
    //                 text: dataIn.text
    //             });
    //             this.cont = this.cont++;
    //         });
    //     });
    // }

    
    cleanNotifications() {
        this.notificationCount = 0;
        localStorage.setItem("countNotification", `0`)
    }
    ionViewDidLeave(){
        this.navigationSub.unsubscribe();
    }


}
