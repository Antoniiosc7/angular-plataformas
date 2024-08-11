import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {MapComponent} from "./map.component";
import {GameOverPopupComponent} from "../components/game-over-popup/game-over-popup.component";
import { MatDialog } from '@angular/material/dialog';
import { System, Box, Circle } from 'detect-collisions';
import {PausePopupComponent} from "../components/pause-popup/pause-popup.component";
import {UTILS} from "../../utils";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    MapComponent
  ],
  template: `
    <div class="score">Score: {{ score }}</div>
    <app-map [characterPosition]="characterPosition" [enemies]="enemies" [blocks]="blocks" [circularEnemies]="circularEnemies" [coins]="coins"></app-map>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

    .score {
      margin-top: 30px;
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 24px;
      color: white;
      background-color: black;
      padding: 5px;
      font-family: 'Press Start 2P', cursive;
      z-index: 10; /* Ensure the score is above the map */
    }
  `]
})
export class GameComponent implements OnInit {
  characterPosition = UTILS.PLAYER_POSITION;
  gravity = UTILS.GRAVITY;
  velocityY = UTILS.VELOCITYY;
  isJumping = false;
  groundLevel = UTILS.GROUNDLEVEL;
  gameSpeed = UTILS.GAMESPEED;
  mapOffset = UTILS.MAPOFFSET;
  score = 0; // Puntuación del juego
  private isPaused = false;
  private isGameOver = false;
  private gravityInterval: any;
  private mapInterval: any;
  private spawnInterval: any;
  private scoreInterval: any;

  platforms: { position: { x: number, y: number } }[] = [];
  blocks: { position: { x: number, y: number } }[] = [];
  enemies: { position: { x: number, y: number } }[] = [];
  circularEnemies: { position: { x: number, y: number } }[] = [];
  coins: { position: { x: number, y: number } }[] = [];

  private collisionSystem: System;
  private characterBody!: Box;

  constructor(
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog)
  {
    this.collisionSystem = new System();
  }

  ngOnInit() {
    this.startGame();
    this.updateCharacterPosition();
  }

  updateCharacterPosition() {
    const screenWidth = window.innerWidth;
    this.characterPosition.x = screenWidth / 2;
    this.characterBody.setPosition(this.characterPosition.x, this.characterPosition.y);
  }

  startGame() {
    this.isGameOver = false;
    this.characterPosition = { x: 200, y: 100 };
    this.velocityY = 0;
    this.isJumping = false;
    this.mapOffset = 0;
    this.score = 0; // Reiniciar la puntuación
    this.platforms = [];
    this.blocks = [];
    this.enemies = [];
    this.circularEnemies = [];
    this.coins = [];
    this.characterBody = this.collisionSystem.createBox(this.characterPosition, 50, 50);
    this.applyGravity();
    this.spawnElements();
    this.moveMap();
    this.updateScore(); // Comenzar a actualizar la puntuación
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp' || event.key === ' ') {
      this.jump();
    } else if (event.key === 'Escape') {
      this.pauseGame();
    }
    this.cdr.detectChanges(); // Forzar detección de cambios
  }

  pauseGame() {
    this.isPaused = true;

    clearInterval(this.gravityInterval);
    clearInterval(this.mapInterval);
    clearInterval(this.spawnInterval);
    clearInterval(this.scoreInterval);


    const dialogRef = this.dialog.open(PausePopupComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'resume') {
        this.isPaused = false;
        this.applyGravity();
        this.moveMap();
        this.spawnElements();
        this.updateScore();
      } else if (result === 'end') {
        this.isGameOver = true;
        this.dialog.open(GameOverPopupComponent);
      }
    });
  }

  applyGravity() {
    this.gravityInterval = setInterval(() => {
      if (this.isGameOver || this.isPaused) {
        clearInterval(this.gravityInterval);
        return;
      }

      if (this.isJumping || this.characterPosition.y > this.groundLevel) {
        this.velocityY -= this.gravity;
        this.characterPosition.y += this.velocityY;
        this.characterBody.setPosition(this.characterPosition.x, this.characterPosition.y);

        // Chequear colisión con plataformas o suelo
        this.checkCollision();

        if (this.characterPosition.y <= this.groundLevel) {
          this.characterPosition.y = this.groundLevel;
          this.isJumping = false;
          this.velocityY = 0;
        }
      }

      // Check collision even if the character is not moving
      this.checkCollision();
    }, 20); // Actualizar la posición cada 20ms
  }

  jump() {
    if (!this.isJumping) {
      this.velocityY = 15; // Velocidad de salto inicial
      this.isJumping = true;
    }
  }

  moveMap() {
    this.mapInterval = setInterval(() => {
      if (this.isGameOver || this.isPaused) {
        clearInterval(this.mapInterval);
        return;
      }

      this.mapOffset += this.gameSpeed;

      // Mover plataformas, bloques y enemigos
      this.platforms.forEach(platform => {
        platform.position.x -= this.gameSpeed;
      });

      this.blocks.forEach(block => {
        block.position.x -= this.gameSpeed;
      });

      this.enemies.forEach(enemy => {
        enemy.position.x -= this.gameSpeed;
      });

      this.circularEnemies.forEach(enemy => {
        enemy.position.x -= this.gameSpeed;
      });

      this.coins.forEach(coin => {
        coin.position.x -= this.gameSpeed;
      });

      // Eliminar plataformas, bloques y enemigos que salieron de la pantalla
      this.platforms = this.platforms.filter(platform => platform.position.x + 100 > 0);
      this.blocks = this.blocks.filter(block => block.position.x + 50 > 0);
      this.enemies = this.enemies.filter(enemy => enemy.position.x + 50 > 0);
      this.circularEnemies = this.circularEnemies.filter(enemy => enemy.position.x + 50 > 0);
      this.coins = this.coins.filter(coin => coin.position.x + 20 > 0);

      this.cdr.detectChanges(); // Actualizar la vista
    }, 20); // Velocidad del movimiento del mapa
  }

  spawnElements() {
    this.spawnInterval = setInterval(() => {
      if (this.isGameOver || this.isPaused) {
        clearInterval(this.spawnInterval);
        return;
      }

      // Ensure no more than 2 coins are present at a time
      if (this.coins.length >= 2) {
        return;
      }

      const screenWidth = window.innerWidth;
      const randomY = 80; // Fixed height for platforms

      // Function to check if the new enemy position is valid
      const isValidPosition = (x: number) => {
        return !this.enemies.some(enemy => Math.abs(enemy.position.x - x) < 100) &&
          !this.circularEnemies.some(enemy => Math.abs(enemy.position.x - x) < 100) &&
          !this.coins.some(coin => Math.abs(coin.position.x - x) < 100);
      };

      // Generate a valid x position for the new enemy
      let enemyX = screenWidth;
      while (!isValidPosition(enemyX)) {
        enemyX -= Math.floor(Math.random() * 200) + 100; // Adjust the x position randomly between 100 and 300 pixels
      }

      // Generar una plataforma aleatoria
      const platform = { position: { x: screenWidth, y: randomY } };
      this.platforms.push(platform);
      this.collisionSystem.createBox(platform.position, 100, 20);

      // Generar un enemigo aleatorio
      const enemyY = Math.floor(Math.random() * 150) + 50; // Posición aleatoria en el eje Y
      const enemy = { position: { x: enemyX, y: enemyY } };
      this.enemies.push(enemy);
      this.collisionSystem.createBox(enemy.position, 50, 50);

      // Generar un bloque en una posición aleatoria
      const blockX = screenWidth;
      const blockY = Math.floor(Math.random() * 100); // Altura aleatoria
      const block = { position: { x: blockX, y: blockY } };
      this.blocks.push(block);
      this.collisionSystem.createBox(block.position, 50, 50);

      // Generate a valid x position for the new circular enemy
      let circularEnemyX = screenWidth;
      while (!isValidPosition(circularEnemyX)) {
        circularEnemyX -= Math.floor(Math.random() * 200) + 100; // Adjust the x position randomly between 100 and 300 pixels
      }

      // Generar un enemigo circular en y=0
      const circularEnemy = { position: { x: circularEnemyX, y: 0 } };
      this.circularEnemies.push(circularEnemy);
      this.collisionSystem.createCircle(circularEnemy.position, 25);

      // Generate a valid x position for the new coin
      let coinX = screenWidth;
      while (!isValidPosition(coinX)) {
        coinX -= Math.floor(Math.random() * 200) + 100; // Adjust the x position randomly between 100 and 300 pixels
      }

      // Generar una moneda en una posición aleatoria
      const coinY = 50; // Adjusted height for coins to match character jump height
      const coin = { position: { x: screenWidth, y: coinY } };
      this.coins.push(coin);
      this.collisionSystem.createCircle(coin.position, 10);

      console.log('Coin spawned at:', coin.position); // Log the coin position

      this.cdr.detectChanges(); // Actualizar la vista
    }, Math.random() * 3000 + 1000); // Random interval between 1 and 4 seconds
  }

  updateScore() {
    this.scoreInterval = setInterval(() => {
      if (this.isGameOver || this.isPaused) {
        clearInterval(this.scoreInterval);
        return;
      }
      this.score++;
      this.cdr.detectChanges(); // Actualizar la vista
    }, UTILS.TIMESPECS.SCOREINCREMENT); // Incrementar la puntuación cada segundo
  }

  resetGame() {
    this.startGame();
  }

  checkCollision() {
    this.collisionSystem.update();

    this.enemies.forEach(enemy => {
      const enemyBody = this.collisionSystem.createBox(enemy.position, 50, 50);
      if (this.collisionSystem.checkOne(this.characterBody, (response) => {
        if (response.b === enemyBody) {
          this.isGameOver = true;
          this.dialog.open(GameOverPopupComponent);
        }
      })) {
        return;
      }
    });

    this.circularEnemies.forEach(enemy => {
      const enemyBody = this.collisionSystem.createCircle(enemy.position, 25);
      if (this.collisionSystem.checkOne(this.characterBody, (response) => {
        if (response.b === enemyBody) {
          const distance = Math.sqrt(
            Math.pow(this.characterPosition.x - enemy.position.x, 2) +
            Math.pow(this.characterPosition.y - enemy.position.y, 2)
          );
          if (distance <= 25 + 25) { // 25 is the radius of the circular enemy and 25 is half the width/height of the character
            this.isGameOver = true;
            this.dialog.open(GameOverPopupComponent);
          }
        }
      })) {
        return;
      }
    });

    this.coins.forEach((coin, index) => {
      const coinBody = this.collisionSystem.createCircle(coin.position, 10);
      if (this.collisionSystem.checkOne(this.characterBody, (response) => {
        if (response.b === coinBody) {
          this.score += 10; // Increase score by 10
          this.coins.splice(index, 1); // Remove the coin from the array
          console.log('Score:', this.score); // Log the score
        }
      })) {
        return;
      }
    });
  }
}
