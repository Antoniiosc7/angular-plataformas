import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CharacterComponent } from '../character/character.component';
import { EnemyComponent } from '../enemy/enemy.component';
import { PlatformComponent } from '../platform/platform.component';
import { NgForOf, NgStyle } from '@angular/common';
import { CircularEnemyComponent } from '../enemy/circular-enemy/circular-enemy.component';
import {CoinComponent} from "../item/coin/coin.component";

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CharacterComponent,
    EnemyComponent,
    PlatformComponent,
    NgForOf,
    NgStyle,
    CircularEnemyComponent,
    CoinComponent
  ],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnChanges {
  @Input() characterPosition: { x: number, y: number } = { x: 0, y: 0 };
  @Input() enemies: { position: { x: number, y: number } }[] = [];
  @Input() blocks: { position: { x: number, y: number } }[] = [];
  @Input() circularEnemies: { position: { x: number, y: number } }[] = [];
  @Input() coins: { position: { x: number, y: number } }[] = [];

  platforms = [
    { position: { x: 0, y: 50 } },
    { position: { x: 150, y: 150 } },
    { position: { x: 300, y: 100 } }
  ];

  ngOnChanges() {
    console.log('Character Position:', this.characterPosition);
  }
}
