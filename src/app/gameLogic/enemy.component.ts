import { Component, Input } from '@angular/core';
import { NgStyle } from "@angular/common";

@Component({
  selector: 'app-enemy',
  standalone: true,
  imports: [
    NgStyle
  ],
  template: `
    <div class="enemy" [ngStyle]="{'left.px': position.x, 'bottom.px': position.y}">
      {{ position.x }}, {{ position.y }}
    </div>
  `,
  styles: [`
    .enemy {
      width: 50px;
      height: 50px;
      background-color: blue; /* Cambiar según diseño del enemigo */
      position: absolute;
      background-image: url('/assets/mario.png'); /* Imagen de enemigo */
      background-size: cover;
    }
  `]
})
export class EnemyComponent {
  @Input() position: { x: number, y: number } = { x: 450, y: 1 };
}
