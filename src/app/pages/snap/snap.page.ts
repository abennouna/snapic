import { Component } from '@angular/core';
import { CameraPhoto, Capacitor, Plugins } from '@capacitor/core';
import { NavController } from '@ionic/angular';
import { EmoticonService } from '../../services/emoticon/emoticon.service';
import { PhotoService } from '../../services/photo/photo.service';
import { PictureOverlayService } from '../../services/picture-overlay/picture-overlay.service';
const { CameraPreview } = Plugins;

@Component({
  selector: 'app-snap',
  templateUrl: 'snap.page.html',
  styleUrls: ['snap.page.scss'],
})
export class SnapPage {
  public isDevice = Capacitor.isNative;

  /**
   * @inheritdoc
   */
  constructor(
    public emoticonService: EmoticonService,
    private navController: NavController,
    public pictureOverlayService: PictureOverlayService,
    public photoService: PhotoService,
  ) {}

  /**
   * @inheritdoc
   */
  private ionViewWillEnter() {
    this.emoticonService.reset();
    this.startPreview();
  }

  /**
   * @inheritdoc
   */
  private ionViewWillLeave() {
    if (CameraPreview.loaded) {
      CameraPreview.stop();
    }
  }

  /**
   */
  public startPreview() {
    CameraPreview.start({
      className: 'camera-preview',
      parent: 'cameraPreviewContainer',
      position: 'front',
    });
  }

  /**
   */
  public flipCamera() {
    CameraPreview.flip();
  }

  /**
   */
  public cancelPreview() {
    CameraPreview.stop();

    this.navController.navigateBack(['/home']);
  }

  /**
   *
   */
  public async takePicture() {
    const result = await CameraPreview.capture();
    const iconsOverlay = document.getElementById('iconsOverlay');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = iconsOverlay.offsetWidth;
    canvas.height = iconsOverlay.offsetHeight;

    // Redraw captured camera preview
    const background = new Image();
    background.src = `data:image/png;base64,${result.value}`;
    background.onload = async () => {
      context.drawImage(
        background,
        0,
        0,
        iconsOverlay.offsetWidth,
        iconsOverlay.offsetHeight,
      );

      const emoticonPromises: Promise<
        void
      >[] = this.emoticonService.emoticons.map((icon, index) => {
        return new Promise(resolve => {
          const overlayIcon = new Image();
          const overlayIconElement = document.getElementById(
            `emoticon-${index}`,
          );

          const path = overlayIconElement.shadowRoot.firstElementChild.firstElementChild.innerHTML
            .replace('<path d="', '')
            .replace('"></path>"', '');

          overlayIcon.onload = async () => {
            context.fillStyle = icon.color;
            // context.font = `${icon.fontSize} sans-serif`;
            context.rotate(
              (Math.PI * parseInt(icon.rotate.replace(/[a-zA-Z \(\)]/g, ''))) /
                180,
            );

            var p = new Path2D(path);
            p.moveTo(
              parseInt(icon.left.replace(/[a-zA-Z ]/g, '')),
              parseInt(icon.top.replace(/[a-zA-Z ]/g, '')),
            );
            context.fill(p);
            // context.drawImage(
            //   overlayIcon,
            //   parseInt(icon.left.replace(/[a-zA-Z ]/g, '')),
            //   parseInt(icon.top.replace(/[a-zA-Z ]/g, '')),
            //   overlayIconElement.offsetWidth,
            //   overlayIconElement.offsetHeight
            // );

            resolve();
          };

          overlayIcon.src = icon.filename;
        });
      });

      const pictureOverlayPromises: Promise<void>[] = [
        new Promise(resolve => {
          const pictureOverlay = new Image();
          const selectedOverlayElement = document.getElementById(
            'selectedOverlay',
          );

          pictureOverlay.onload = async () => {
            context.drawImage(
              pictureOverlay,
              selectedOverlayElement.offsetLeft,
              selectedOverlayElement.offsetTop,
              selectedOverlayElement.offsetWidth,
              selectedOverlayElement.offsetHeight,
            );

            resolve();
          };

          pictureOverlay.src = this.pictureOverlayService.selectedOverlay.filename;
        }),
      ];

      const foodPromises: Promise<void>[] = this.emoticonService.foods.map(
        (icon, index) => {
          return new Promise(resolve => {
            const overlayIcon = new Image();
            const overlayIconElement = document.getElementById(`food-${index}`);

            overlayIcon.onload = async () => {
              // set composite mode
              context.fillStyle = icon.color;
              context.strokeStyle = icon.color;
              context.font = `${icon.fontSize} sans-serif`;
              context.rotate(
                (Math.PI *
                  parseInt(icon.rotate.replace(/[a-zA-Z \(\)]/g, ''))) /
                  180,
              );

              context.drawImage(
                overlayIcon,
                parseInt(icon.left.replace(/[a-zA-Z ]/g, '')),
                parseInt(icon.top.replace(/[a-zA-Z ]/g, '')),
                overlayIconElement.offsetWidth,
                overlayIconElement.offsetHeight,
              );

              resolve();
            };

            overlayIcon.src = icon.filename;
          });
        },
      );

      Promise.all(
        emoticonPromises.concat(foodPromises).concat(pictureOverlayPromises),
      ).then(async () => {
        const photo: CameraPhoto = {
          base64String: canvas
            .toDataURL('image/png')
            .replace('data:image/png;base64,', ''),
          format: 'jpeg',
        };

        await this.photoService.addNewToGallery(photo);

        this.navController.navigateBack(['/home']);

        CameraPreview.stop();
      });
    };
  }
}
