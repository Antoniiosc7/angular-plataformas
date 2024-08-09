import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {MapComponent} from "../map/map.component";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    MapComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {
  characterPosition = { x: 50, y: 100 };
  gravity = 1;
  velocityY = 0; // Velocidad vertical
  isJumping = false;
  groundLevel = 0; // Nivel del suelo
  gameSpeed = 5; // Velocidad del movimiento del mapa
  mapOffset = 0; // Desplazamiento del mapa

  platforms = [
    { position: { x: 0, y: 50 } },
    { position: { x: 150, y: 150 } },
    { position: { x: 300, y: 100 } }
  ];

  blocks: { position: { x: number, y: number } }[] = [];
  enemies: { position: { x: number, y: number } }[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.applyGravity(); // Comenzar a aplicar la gravedad
    this.moveMap(); // Comenzar a mover el mapa
    this.spawnElements(); // Generar bloques y enemigos periódicamente
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowLeft':
        this.moveLeft();
        break;
      case 'ArrowRight':
        this.moveRight();
        break;
      case 'ArrowUp':
        this.jump();
        break;
    }
    this.cdr.detectChanges(); // Forzar detección de cambios
  }

  applyGravity() {
    setInterval(() => {
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

  moveLeft() {
    this.characterPosition.x -= 10;
    this.checkCollision();
  }

  moveRight() {
    this.characterPosition.x += 10;
    this.checkCollision();
  }

  jump() {
    this.characterPosition.y += 50;
    setTimeout(() => {
      this.characterPosition.y -= this.gravity;
      this.checkCollision();
    }, 200);
  }

  moveMap() {
    setInterval(() => {
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

    }, 20); // Velocidad del movimiento del mapa
  }

  canPlaceBlock(x: number, y: number): boolean {
    if (y === 0) return true;
    return this.blocks.some(block =>
      (block.position.x === x && block.position.y === y - 1) || // Below
      (block.position.x === x && block.position.y === y + 1) || // Above
      (block.position.x === x - 1 && block.position.y === y) || // Left
      (block.position.x === x + 1 && block.position.y === y)    // Right
    );
  }

  spawnElements() {
    setInterval(() => {
      // Generar una plataforma aleatoria
      const randomY = Math.floor(Math.random() * 150) + 50; // Posición aleatoria en el eje Y
      this.platforms.push({ position: { x: 600, y: randomY } });

      // Generar un enemigo aleatorio
      const enemyY = Math.floor(Math.random() * 150) + 50; // Posición aleatoria en el eje Y
      this.enemies.push({ position: { x: 800, y: enemyY } });

      // Generar un bloque en el suelo
      const blockX = 600;
      const blockY = Math.floor(Math.random() * 5); // Altura entre 0 y 4
      if (this.canPlaceBlock(blockX, blockY)) {
        this.blocks.push({ position: { x: blockX, y: blockY } });
      }

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
        // Aquí podrías implementar la lógica de colisión (por ejemplo, perder vida, reiniciar el nivel, etc.)
        console.log('Colisión con enemigo!');
      }
    });
  }
}
