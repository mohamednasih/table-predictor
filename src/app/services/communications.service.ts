import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Fixture } from '../models/fixture';
import { Team } from '../models/team';

@Injectable({
  providedIn: 'root'
})
export class CommunicationsService {
  subjectTable:Subject<Team[]>=new Subject<Team[]>();
  tableObservaleTable:Observable<Team[]>=this.subjectTable.asObservable();

  subjectFixtures:Subject<Fixture[]>=new Subject<Fixture[]>();
  fixturesObservable: Observable<Fixture[]>=this.subjectFixtures.asObservable();
  constructor() { }
}
