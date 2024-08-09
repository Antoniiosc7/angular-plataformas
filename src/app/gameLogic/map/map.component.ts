import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {CharacterComponent} from "../character/character.component";
import {EnemyComponent} from "../enemy/enemy.component";
import {PlatformComponent} from "../platform/platform.component";
import {NgForOf, NgStyle} from "@angular/common";

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CharacterComponent,
    EnemyComponent,
    PlatformComponent,
    NgForOf,
    NgStyle
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnChanges {
  @Input() characterPosition: { x: number, y: number } = {x: 0, y: 0}; // Valor por defecto
  @Input() enemies: { position: { x: number, y: number } }[] = [];
  @Input() blocks: { position: { x: number, y: number } }[] = [];

  platforms = [
    {position: {x: 0, y: 50}},
    {position: {x: 150, y: 150}},
    {position: {x: 300, y: 100}}
  ];

  ngOnChanges() {
    console.log('Character Position:', this.characterPosition);
  }
}
