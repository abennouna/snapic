import { Injectable } from '@angular/core';

interface PictureOverlay {
  filename?: string;
  name: string;
}
interface Eyeglass extends PictureOverlay {}
interface FunnyFace extends PictureOverlay {}
interface Hat extends PictureOverlay {}
interface Mask extends PictureOverlay {}

@Injectable({
  providedIn: 'root',
})
export class PictureOverlayService {
  private availableEyeglasses: Eyeglass[] = [{ name: 'psychedelic' }];
  private availableFunnyFaces: FunnyFace[] = [{ name: 'groucho' }];
  private availableHats: Hat[] = [{ name: 'purple' }];
  private availableMasks: Mask[] = [{ name: 'venice-red' }];
  private eyeglassPath = 'assets/eyeglasses';
  private funnyFacePath = 'assets/funny-faces';
  private hatPath = 'assets/hats';
  private maskPath = 'assets/mask';
  public selectedOverlay: Eyeglass | FunnyFace | Hat | Mask;

  /**
   * @returns void
   */
  public addEyeglass(): void {
    this.addPictureOverlay({
      collection: this.availableEyeglasses,
      picturePath: this.eyeglassPath,
    });
  }

  /**
   * @returns void
   */
  public addFunnyFace(): void {
    this.addPictureOverlay({
      collection: this.availableFunnyFaces,
      picturePath: this.funnyFacePath,
    });
  }

  /**
   * @returns void
   */
  public addHat(): void {
    this.addPictureOverlay({
      collection: this.availableHats,
      picturePath: this.hatPath,
    });
  }

  /**
   * @returns void
   */
  public addMask(): void {
    this.addPictureOverlay({
      collection: this.availableMasks,
      picturePath: this.maskPath,
    });
  }

  /**
   * @param  {{collection:Eyeglass[]|FunnyFace[]|Hat[]|Mask[];picturePath:string;}} data
   * @returns void
   */
  private addPictureOverlay(data: {
    collection: Eyeglass[] | FunnyFace[] | Hat[] | Mask[];
    picturePath: string;
  }): void {
    const picture =
      data.collection[Math.floor(Math.random() * data.collection.length)];

    this.selectedOverlay = {
      ...picture,
      filename: `${data.picturePath}/${picture.name}.png`,
    };
  }

  /**
   */
  public reset() {
    this.selectedOverlay = null;
  }
}
