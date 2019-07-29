import { TestBed } from '@angular/core/testing';

import { SolrclientService } from './solrclient.service';

describe('SolrclientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SolrclientService = TestBed.get(SolrclientService);
    expect(service).toBeTruthy();
  });
});
