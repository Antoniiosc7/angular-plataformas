import { Component, Input } from '@angular/core';
import { NgStyle } from "@angular/common";

@Component({
  selector: 'app-platform',
  standalone: true,
  imports: [
    NgStyle
  ],
  template: `
    <div class="platform" [ngStyle]="{'left.px': position.x, 'bottom.px': position.y}">
    </div>
  `,
  styles: [`
    .platform {
      width: 100px;
      height: 20px;
      background-color: brown;
      position: absolute;
    }
  `]
})
export class PlatformComponent {
  @Input() position: { x: number, y: number } = { x: 0, y: 0 };
}
