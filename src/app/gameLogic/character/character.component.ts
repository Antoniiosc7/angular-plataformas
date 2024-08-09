import {Component, Input} from '@angular/core';
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-character',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './character.component.html',
  styleUrl: './character.component.css'
})
export class CharacterComponent {
  @Input() position: { x: number, y: number } = { x: 0, y: 0 };
}
