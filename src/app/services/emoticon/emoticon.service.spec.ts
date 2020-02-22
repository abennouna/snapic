import { TestBed } from '@angular/core/testing';
import { EmoticonService } from './emoticon.service';

describe('EmoticonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmoticonService = TestBed.get(EmoticonService);
    expect(service).toBeTruthy();
  });
});
