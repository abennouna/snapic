import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { PhotoService } from '../../services/photo/photo.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  /**
   * @inheritdoc
   */
  constructor(
    public actionSheetController: ActionSheetController,
    public photoService: PhotoService,
  ) {}

  /**
   * @inheritdoc
   */
  ngOnInit() {
    this.photoService.loadSaved();
  }

  /**
   * @param  {} photo
   * @param  {} position
   */
  public async showActionSheet(photo, position) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [
        {
          text: 'Supprimer',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.photoService.deletePicture(photo, position);
          },
        },
        {
          text: 'Annuler',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            // Nothing to do, action sheet is automatically closed
          },
        },
      ],
    });

    await actionSheet.present();
  }
}
