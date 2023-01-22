import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Team } from '../models/team';

@Injectable({
  providedIn: 'root'
})
export class CommunicationsService {
  subjectTable:Subject<Team[]>=new Subject<Team[]>();
  tableObservaleTable:Observable<Team[]>=this.subjectTable.asObservable();
  constructor() { }
}
