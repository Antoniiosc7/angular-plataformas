import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CharacterComponent } from './character.component';
import { EnemyComponent } from './enemy.component';
import { PlatformComponent } from './platform.component';
import { NgForOf, NgStyle } from '@angular/common';
import { CircularEnemyComponent } from './circular-enemy.component';
import { CoinComponent } from './coin.component';

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
  template: `
    <div class="map">
      <app-character [position]="characterPosition"></app-character>
      <app-enemy *ngFor="let enemy of enemies" [position]="enemy.position"></app-enemy>
      <app-platform *ngFor="let platform of platforms" [position]="platform.position"></app-platform>
      <app-platform *ngFor="let block of blocks" [position]="block.position"></app-platform>
      <app-circular-enemy *ngFor="let enemy of circularEnemies" [position]="enemy.position"></app-circular-enemy>
      <app-coin *ngFor="let coin of coins" [position]="coin.position"></app-coin>
    </div>
  `,
  styles: [`
    .map {
      width: 100%;
      height: 400px;
      position: relative;
      background-color: lightblue;
      overflow: hidden;
    }
    .block {
      background-color: brown;
      width: 50px;
      height: 50px;
      position: absolute;
    }
  `]
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
