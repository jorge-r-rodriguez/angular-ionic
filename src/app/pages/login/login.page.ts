import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonInput,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
  ],
})
export class LoginPage {
  private readonly router = inject(Router);

  login(): void {
    this.router.navigate(['/products']);
  }
}
