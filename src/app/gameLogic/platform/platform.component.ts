import {Component, Input} from '@angular/core';
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-platform',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './platform.component.html',
  styleUrl: './platform.component.css'
})
export class PlatformComponent {
  @Input() position: { x: number, y: number } = { x: 0, y: 0 };
}
