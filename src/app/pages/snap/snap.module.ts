import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SnapPageRoutingModule } from './snap-routing.module';
import { SnapPage } from './snap.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SnapPageRoutingModule],
  declarations: [SnapPage],
})
export class SnapPageModule {}
