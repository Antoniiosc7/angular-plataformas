import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {MapComponent} from "../map/map.component";
import {GameOverPopupComponent} from "../../components/game-over-popup/game-over-popup.component";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    MapComponent
  ],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  characterPosition = { x: 200, y: 100 }; // Posición centrada del personaje
  gravity = 1;
  velocityY = 0; // Velocidad vertical
  isJumping = false;
  groundLevel = 0; // Nivel del suelo
  gameSpeed = 5; // Velocidad del movimiento del mapa
  mapOffset = 0; // Desplazamiento del mapa
  isGameOver = false; // Estado del juego
  score = 0; // Puntuación del juego

  platforms: { position: { x: number, y: number } }[] = [];
  blocks: { position: { x: number, y: number } }[] = [];
  enemies: { position: { x: number, y: number } }[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog) {}

  ngOnInit() {
    this.startGame();
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
    this.applyGravity();
    this.spawnElements();
    this.moveMap();
    this.updateScore(); // Comenzar a actualizar la puntuación
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      this.jump();
    }
    this.cdr.detectChanges(); // Forzar detección de cambios
  }

  applyGravity() {
    const gravityInterval = setInterval(() => {
      if (this.isGameOver) {
        clearInterval(gravityInterval);
        return;
      }

      if (this.isJumping || this.characterPosition.y > this.groundLevel) {
        this.velocityY -= this.gravity;
        this.characterPosition.y += this.velocityY;

        // Chequear colisión con plataformas o suelo
        this.checkCollision();

        if (this.characterPosition.y <= this.groundLevel) {
          this.characterPosition.y = this.groundLevel;
          this.isJumping = false;
          this.velocityY = 0;
        }
      }
    }, 20); // Actualizar la posición cada 20ms
  }

  jump() {
    if (!this.isJumping) {
      this.velocityY = 15; // Velocidad de salto inicial
      this.isJumping = true;
    }
  }

  moveMap() {
    const mapInterval = setInterval(() => {
      if (this.isGameOver) {
        clearInterval(mapInterval);
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

      // Eliminar plataformas, bloques y enemigos que salieron de la pantalla
      this.platforms = this.platforms.filter(platform => platform.position.x + 100 > 0);
      this.blocks = this.blocks.filter(block => block.position.x + 50 > 0);
      this.enemies = this.enemies.filter(enemy => enemy.position.x + 50 > 0);

      this.cdr.detectChanges(); // Actualizar la vista
    }, 20); // Velocidad del movimiento del mapa
  }

  spawnElements() {
    const spawnInterval = setInterval(() => {
      if (this.isGameOver) {
        clearInterval(spawnInterval);
        return;
      }

      const randomY = Math.floor(Math.random() * 150) + 50; // Posición aleatoria en el eje Y

      // Generar una plataforma aleatoria
      this.platforms.push({ position: { x: 800, y: randomY } });

      // Generar un enemigo aleatorio
      const enemyY = Math.floor(Math.random() * 150) + 50; // Posición aleatoria en el eje Y
      this.enemies.push({ position: { x: 800, y: enemyY } });

      // Generar un bloque en una posición aleatoria
      const blockX = 800;
      const blockY = Math.floor(Math.random() * 100); // Altura aleatoria
      this.blocks.push({ position: { x: blockX, y: blockY } });

      this.cdr.detectChanges(); // Actualizar la vista
    }, 2000); // Intervalo para la generación de bloques y enemigos (2 segundos)
  }

  checkCollision() {
    this.platforms.forEach(platform => {
      const platformX = platform.position.x;
      const platformY = platform.position.y;

      if (this.characterPosition.x < platformX + 100 &&
        this.characterPosition.x + 50 > platformX &&
        this.characterPosition.y <= platformY + 20 &&
        this.characterPosition.y + 50 > platformY) {
        this.characterPosition.y = platformY + 20;
        this.isJumping = false;
        this.velocityY = 0;
      }
    });

    this.blocks.forEach(block => {
      const blockX = block.position.x;
      const blockY = block.position.y;

      if (this.characterPosition.x < blockX + 50 &&
        this.characterPosition.x + 50 > blockX &&
        this.characterPosition.y <= blockY + 50 &&
        this.characterPosition.y + 50 > blockY) {
        this.characterPosition.y = blockY + 50;
        this.isJumping = false;
        this.velocityY = 0;
      }
    });

    this.enemies.forEach(enemy => {
      const enemyX = enemy.position.x;
      const enemyY = enemy.position.y;

      // Verificar colisión con el enemigo
      if (this.characterPosition.x < enemyX + 50 &&
        this.characterPosition.x + 50 > enemyX &&
        this.characterPosition.y < enemyY + 50 &&
        this.characterPosition.y + 50 > enemyY) {
        this.isGameOver = true;
        this.dialog.open(GameOverPopupComponent);
      }
    });
  }

  updateScore() {
    const scoreInterval = setInterval(() => {
      if (this.isGameOver) {
        clearInterval(scoreInterval);
        return;
      }
      this.score++;
      this.cdr.detectChanges(); // Actualizar la vista
    }, 1000); // Incrementar la puntuación cada segundo
  }

  resetGame() {
    this.startGame();
  }
}
