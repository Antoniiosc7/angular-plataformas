import { Component, Input } from '@angular/core';
import { NgStyle } from "@angular/common";

@Component({
  selector: 'app-circular-enemy',
  standalone: true,
  imports: [
    NgStyle
  ],
  template: `
    <div class="circular-enemy" [ngStyle]="{'left.px': position.x, 'bottom.px': position.y}">
      {{ position.x }}, {{ position.y }}
    </div>
  `,
  styles: [`
    .circular-enemy {
      width: 50px;
      height: 50px;
      background-color: red;
      border-radius: 50%;
      position: absolute;
    }
  `]
})
export class CircularEnemyComponent {
  @Input() position: { x: number, y: number } = { x: 800, y: 0 };
}
