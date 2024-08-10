import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-coin',
  standalone: true,
  template: '<div class="coin" [ngStyle]="{ left: position.x + \'px\', bottom: position.y + \'px\' }"></div>',
  imports: [NgStyle],
  styles: [`
    .coin {
      width: 20px;
      height: 20px;
      background-color: yellow;
      border-radius: 50%;
      position: absolute;
      z-index: 100; /* Ensure the coin is above other elements */
    }
  `]
})
export class CoinComponent implements OnChanges {
  @Input() position!: { x: number, y: number };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['position']) {
      console.log('Coin position:', this.position);
    }
  }
}
