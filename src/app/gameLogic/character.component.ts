import { Component, Input } from '@angular/core';
import { NgStyle } from "@angular/common";

@Component({
  selector: 'app-character',
  standalone: true,
  imports: [
    NgStyle
  ],
  template: `
    <div class="character" [ngStyle]="{'left.px': position.x, 'bottom.px': position.y}">
      {{ position.x }}, {{ position.y }}
    </div>
  `,
  styles: [`
    .character {
      width: 50px;
      height: 50px;
      background-color: red; /* O usa una imagen de Mario */
      position: absolute; /* Esto es crucial para que se mueva */
      /*background-image: url('/assets/mario.png');*/
      background-size: cover;
    }
  `]
})
export class CharacterComponent {
  @Input() position: { x: number, y: number } = { x: 0, y: 0 };
}
