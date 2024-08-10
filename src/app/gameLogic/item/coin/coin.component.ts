import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-coin',
  standalone: true,
  template: '',
  styles: [`
    :host {
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
