import { Component } from '@angular/core';
import {GameComponent} from "../../gameLogic/game.component";

@Component({
  selector: 'app-play',
  standalone: true,
    imports: [
        GameComponent
    ],
  templateUrl: './play.component.html',
  styleUrl: './play.component.css'
})
export class PlayComponent {

}
