import { TestBed } from '@angular/core/testing';
import { PictureOverlayService } from './picture-overlay.service';

describe('PictureOverlayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PictureOverlayService = TestBed.get(PictureOverlayService);
    expect(service).toBeTruthy();
  });
});
