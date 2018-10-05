import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { AuthService } from './auth.service';
import * as moment from 'moment';

@Injectable()
export class ReservesService {
  reserveDetail: any;

  constructor(private appService: AppService, private authService: AuthService) {}

  createReserve(lessonId) {
    let userId = this.authService.userId;
    let data = {
      status: 1,
      userId: userId,
      insUser: userId
    };

    let url = this.appService.gateway + '/api/lessons/' + lessonId + '/membership-lesson';

    return this.authService.post(url, data);
  }

  createMultipleReserves(data, lessonId) {
    let url = this.appService.gateway + '/api/lessons/' + lessonId + '/membership-lesson/recurrent';
    return this.authService.post(url, data);
  }

  deleteReserve(lessonRecordId, reserveId) {
    let url = this.appService.gateway + '/api/lessons/' + lessonRecordId + '/membership-lesson/' + reserveId;
    return this.authService.delete(url);
  }

  getReserves() {
    let userId = this.authService.userId;
    let dateHour = moment().format('YYYY-MM-DD hh:mm');
    let url = this.appService.gateway + '/api/user-establishment/' + userId + '/reserves?date=' + dateHour;
    return this.authService.get(url);
  }

  /*Waiting List*/
  public deleteWaitingList(lessonRecordId, userId) {
    return this.authService
      .delete(this.appService.gateway + '/api/waiting-list/by-user/' + userId + '/' + lessonRecordId);
  }

  public getWaitingListByUser(userId) {
    return this.authService
      .get(this.appService.gateway + `/api/waiting-list/${userId}/by-user/` );
  }

  /*Appointments*/
  createAppointment(data) {
    let urlAppointment = this.appService.gateway + '/api/schedule/lesson-record-and-membership';
    return this.authService.post(urlAppointment, data);
  }

  /*Raiting and Comment*/
  sendRaiting(lessonRecordId, score){
    const urlScoreLesson = `${this.appService.gateway}/api/lessons/${lessonRecordId}/rate-lesson`;
    return this.authService.put(urlScoreLesson, score);
  }

  sendComment(lessonRecordId, comment){
      const urlCommentLesson = `${this.appService.gateway}/api/lessons/${lessonRecordId}/comment-lesson`;
      return this.authService.put(urlCommentLesson, comment);
  }
}