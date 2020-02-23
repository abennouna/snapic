import { Component, Renderer2 } from '@angular/core';
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
    public renderer: Renderer2,
  ) {}

  /**
   * @inheritdoc
   */
  private ionViewWillEnter() {
    this.renderer.addClass(document.body, 'has-camera-preview');
    this.emoticonService.reset();
    this.pictureOverlayService.reset();
    this.startPreview();
  }

  /**
   * @inheritdoc
   */
  private ionViewWillLeave() {
    this.renderer.removeClass(document.body, 'has-camera-preview');

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
   * https://jsfiddle.net/yhzuet8L/1/
   *
   * @param  {string} base64data
   * @param  {{degrees:number;enableURI:boolean;height?:number;width?:number;}} options
   * @returns Promise<{ date: string; dimensions: { height: number, width: number } }>
   */
  private rotate64(
    base64data: string,
    options: {
      degrees: number;
      enableURI: boolean;
      height?: number;
      width?: number;
    } = { degrees: 90, enableURI: true },
  ): Promise<{ data: string; dimensions: { height: number; width: number } }> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      canvas.style.display = 'none';
      document.body.appendChild(canvas);

      const ctx = canvas.getContext('2d');

      const image = new Image();

      image.onload = () => {
        const w = image.width;
        const h = image.height;
        const rads = (options.degrees * Math.PI) / 180;

        let c = Math.cos(rads);
        if (c < 0) {
          c = -c;
        }
        let s = Math.sin(rads);
        if (s < 0) {
          s = -s;
        }

        //use translated width and height for new canvas
        canvas.width = h * s + w * c;
        canvas.height = h * c + w * s;

        //draw the rect in the center of the newly sized canvas
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((options.degrees * Math.PI) / 180);
        ctx.drawImage(image, -w / 2, -h / 2);

        //assume plain base64 if not provided
        resolve({
          data: options.enableURI
            ? canvas.toDataURL()
            : canvas.toDataURL().split(',')[1],
          dimensions: { height: canvas.height, width: canvas.width },
        });

        document.body.removeChild(canvas);
      };

      image.onerror = () => {
        reject('Unable to rotate data\n' + image.src);
      };

      //assume png if not provided
      image.src =
        (base64data.indexOf(',') == -1 ? 'data:image/png;base64,' : '') +
        base64data;
    });
  }

  /**
   *
   */
  public async takePicture() {
    const result = await CameraPreview.capture();

    // Redraw captured camera preview, rotated if necessary
    const background = new Image();
    new Promise(resolve => {
      this.rotate64(result.value, {
        degrees: this.isDevice ? 90 : 0,
        enableURI: true,
      }).then(result => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = result.dimensions.height;
        canvas.width = result.dimensions.width;

        background.src = result.data;

        background.onload = async () => {
          context.drawImage(background, 0, 0, canvas.width, canvas.height);

          const pictureOverlayPromises: Promise<void>[] = [
            new Promise(resolve => {
              const pictureOverlayElement = document.getElementById(
                'pictureOverlay',
              );
              const selectedOverlayElement = document.getElementById(
                'selectedOverlay',
              );

              if (selectedOverlayElement) {
                const cameraPreviewContainer = new Image();

                cameraPreviewContainer.onload = async () => {
                  context.drawImage(
                    cameraPreviewContainer,
                    (selectedOverlayElement.offsetLeft * canvas.width) /
                      pictureOverlayElement.offsetWidth,
                    (selectedOverlayElement.offsetTop * canvas.height) /
                      pictureOverlayElement.offsetHeight,
                    (selectedOverlayElement.offsetWidth * canvas.width) /
                      pictureOverlayElement.offsetWidth,
                    (selectedOverlayElement.offsetHeight * canvas.height) /
                      pictureOverlayElement.offsetHeight,
                  );
                  resolve();
                };

                cameraPreviewContainer.src = this.pictureOverlayService.selectedOverlay.filename;
              } else {
                resolve();
              }
            }),
          ];

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
                  (Math.PI *
                    parseInt(icon.rotate.replace(/[a-zA-Z \(\)]/g, ''))) /
                    180,
                );

                const p = new Path2D(path);
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

          const foodPromises: Promise<void>[] = this.emoticonService.foods.map(
            (icon, index) => {
              return new Promise(resolve => {
                const overlayIcon = new Image();
                const overlayIconElement = document.getElementById(
                  `food-${index}`,
                );

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
            emoticonPromises
              .concat(foodPromises)
              .concat(pictureOverlayPromises),
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
      });
    });
  }
}
