import { TestBed } from '@angular/core/testing';

import { AngularRouterExtenderService } from './angular-router-extender.service';

describe('AngularRouterExtenderService', () => {
  let service: AngularRouterExtenderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularRouterExtenderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
