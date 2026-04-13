import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { businessOutline, mailOutline, person } from 'ionicons/icons';
import {
  IonBackButton,
  IonButtons,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonBackButton,
    IonButtons,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonToolbar,
  ],
})
export class ProfilePage {
  private readonly router = inject(Router);

  readonly user = {
    name: 'Juan Perez',
    email: 'juan.perez@ejemplo.com',
    company: 'SDi Digital Group',
  };

  constructor() {
    addIcons({ person, mailOutline, businessOutline });
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
