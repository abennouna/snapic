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
  private availableEyeglasses: Eyeglass[] = [
    { name: 'aviator' },
    { name: 'brown-frames' },
    { name: 'butterfly' },
    { name: 'carrera' },
    { name: 'clubmaster' },
    { name: 'doll-ribbon' },
    { name: 'gold-frames' },
    { name: 'john-lennon' },
    { name: 'psychedelic' },
    { name: 'ray-ban-aviator' },
    { name: 'wayfarer' },
  ];
  private availableFunnyFaces: FunnyFace[] = [
    { name: 'angry-eyes' },
    { name: 'clown' },
    { name: 'eyes-glasses' },
    { name: 'eyes-mouth' },
    { name: 'groucho' },
  ];
  private availableHats: Hat[] = [
    { name: 'chef-toque' },
    { name: 'cowboy-police' },
    { name: 'cowboy' },
    { name: 'knit-cap' },
    { name: 'sherlock-deerstalker-cap' },
    { name: 'steampunk-fashion' },
    { name: 'stetson-bucket' },
    { name: 'purple' },
    { name: 'witch-halloween' },
    { name: 'with-black-and-purple' },
  ];
  private availableMasks: Mask[] = [
    { name: 'brazilian-carnival' },
    { name: 'columbina-blindfold' },
    { name: 'mardi-gras' },
    { name: 'masquerade-purple-and-teal' },
    { name: 'venice-black-and-brown' },
    { name: 'venice-blue-and-gold' },
    { name: 'venice-red' },
  ];
  private eyeglassPath = 'assets/eyeglasses';
  private funnyFacePath = 'assets/funny-faces';
  private hatPath = 'assets/hats';
  private maskPath = 'assets/masks';
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
