import { TestBed } from '@angular/core/testing';

import { LokiTransport } from './loki-transport.service';

describe('LokiTransport', () => {
  let service: LokiTransport;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LokiTransport);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
