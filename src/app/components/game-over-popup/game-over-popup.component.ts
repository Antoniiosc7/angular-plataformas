import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-game-over-popup',
  standalone: true,
  templateUrl: './game-over-popup.component.html',
  styleUrls: ['./game-over-popup.component.css']
})
export class GameOverPopupComponent {

  constructor(private router: Router, private dialogRef: MatDialogRef<GameOverPopupComponent>) {}

  closePopup() {
    this.dialogRef.close();
  }

  goToHome() {
    this.router.navigate(['/']);
    this.closePopup();
  }

  restartGame() {
    this.router.navigate(['/play']).then(() => {
      window.location.reload();
    });
    this.closePopup();
  }
}
