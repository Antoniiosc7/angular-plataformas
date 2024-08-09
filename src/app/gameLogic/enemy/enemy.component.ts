import {Component, Input} from '@angular/core';
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-enemy',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './enemy.component.html',
  styleUrl: './enemy.component.css'
})
export class EnemyComponent {
  @Input() position: { x: number, y: number } = { x: 450, y: 1 };
}
