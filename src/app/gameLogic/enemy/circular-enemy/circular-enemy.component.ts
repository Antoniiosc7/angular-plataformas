import {Component, Input} from '@angular/core';
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-circular-enemy',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './circular-enemy.component.html',
  styleUrls: ['./circular-enemy.component.css']
})
export class CircularEnemyComponent {
  @Input() position: { x: number, y: number } = { x: 800, y: 0 };
}
