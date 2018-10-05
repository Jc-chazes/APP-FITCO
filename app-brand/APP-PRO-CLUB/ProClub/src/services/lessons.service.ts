import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { AuthService } from './auth.service';
import * as moment from 'moment';

@Injectable()
export class LessonsService {
  lessonDetail: any;

  constructor(private appService: AppService, private authService: AuthService) {}

  getLessons(date: string) {
    let establishmentId = this.authService.establishmentId;
    let url =
      this.appService.gateway +
      '/api/lessons/by-establishment/by-lesson-record/' +
      establishmentId +
      '?startDate=' +
      date +
      '&endDate=' +
      date;

    return this.authService.get(url);
  }

  getLessonsReserved(date: string) {
    let userId = this.authService.userId;
    let dateFormat = moment(date).format('YYYY-MM-DD');

    let url =
      this.appService.gateway +
      '/api/lessons/by-establishment/by-lesson_membership/' +
      userId +
      '?startDate=' +
      dateFormat +
      '&endDate=' +
      dateFormat;

    return this.authService.get(url);
  }

  getLessonsByDate(date: string,establishmentId) {

    let userId = this.authService.userId;
    let url =
      this.appService.gateway +
      '/api/lessons/by-establishment/' +
      establishmentId +
      '/by-user/' +
      userId +
      '?startDate=' +
      date +
      '&endDate=' +
      date;

    return this.authService.get(url);
  }

  getUnpaidLessons() {
    let establishmentId = this.authService.establishmentId;
    let userId = this.authService.userId;
    let url = this.appService.gateway + '/api/unpaid/' + establishmentId + '/' + userId + '/by-user-all';

    return this.authService.get(url);
  }

  public getWaitingList(lessonRecordId) {
    let url = this.appService.gateway + `/api/waiting-list/${lessonRecordId}/by-lesson`;
    return this.authService.get(url);
  }

  getListServices(establishmentId?) {
    establishmentId = establishmentId != null ? establishmentId : this.authService.establishmentId;
    let urlListServices = this.appService.gateway +
        `/api/disciplines/${establishmentId}/by-establishment?cbp=ALL&orderby=id&typeD=1`;

    return this.authService.get(urlListServices);
  }

  getShowtimesAvailables(date, serviceId) {
    let establishmentId = this.authService.establishmentId;
    let urlShowtimes = this.appService.gateway +
        `/api/schedule/lesson-app/${establishmentId}/${serviceId}?&date=${date}`;

    return this.authService.get(urlShowtimes);
  }
}
