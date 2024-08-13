import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { API_URL } from "../../../config";

@Component({
  selector: 'app-game-over-popup',
  standalone: true,
  templateUrl: './game-over-popup.component.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['./game-over-popup.component.css']
})
export class GameOverPopupComponent {
  userName: string = '';
  score: number;

  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<GameOverPopupComponent>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.score = data.score;
  }

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

  saveScore() {
    const scoreData = {
      username: this.userName,
      score: this.score
    };

    this.http.post(`${API_URL}/api/plataformas/save`, scoreData).subscribe(response => {
      console.log('Score saved:', response);
      this.closePopup();
    });
  }
}
