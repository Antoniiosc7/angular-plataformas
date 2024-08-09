import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {GameComponent} from "./gameLogic/game/game.component";
import {MiniHeaderComponent} from "./components/mini-header/mini-header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GameComponent, MiniHeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-plataformas';
}
