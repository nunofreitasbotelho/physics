import { Component, OnInit, OnChanges } from "@angular/core";

interface Ball {
  color: string;
  size: number;
  positionX: number;
  positionY: number;
  velocity: number;
  time: number;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  balls: Ball[] = [];
  viewportHeight: number;
  viewportWidth: number;

  constructor() {}

  ngOnInit(): void {
    this.viewportHeight = window.innerHeight;
    this.viewportWidth = window.innerWidth;

    // Uses redraw as callback before each repaint.
    // Keeps calling requestAnimationFrame
    const redraw = () => {
      this.balls.forEach((ball: Ball) => {
        this.checkBounds(ball);
      });
      requestAnimationFrame(redraw);
    };
    redraw();
  }

  /**
   * Handles the ball position while verifying if any hits the max/min bounds.
   *
   * @param {Ball} ball
   * @memberof AppComponent
   */
  checkBounds(ball: Ball) {
    const now = (Date.now() - ball.time) / 1000;

    if (ball.positionX <= this.viewportWidth && ball.positionX >= 0) {
      ball.positionX += ball.velocity * now;
    } else {
      ball.positionX -= ball.velocity * now;
    }

    if (ball.positionY <= this.viewportHeight && ball.positionY >= 0) {
      ball.positionY += ball.velocity * now - 0.5 * 0.1 * now;
    } else {
      ball.positionY -= ball.velocity * now - 0.5 * 0.1 * now;
    }

    if (
      ball.positionY == (this.viewportHeight || 0) ||
      ball.positionX == (this.viewportWidth || 0)
    ) {
      ball.velocity -= ball.velocity * 0.1;
    }
  }

  /**
   * Detects the click event and captures the click coordinates.
   *
   * @param {MouseEvent} e
   * @memberof AppComponent
   */
  clickStage(e: MouseEvent): void {
    const clientX = e.clientX;
    const clientY = e.clientY;

    this.createBall(clientX, clientY);
  }

  /**
   * Handles the ball creation.
   *
   * @param {number} clientX
   * @param {number} clientY
   * @memberof AppComponent
   */
  createBall(clientX: number, clientY: number): void {
    let ball: Ball = {
      positionX: clientX,
      positionY: clientY,
      color: this.generateColor(),
      size: this.generateSize(),
      velocity: 5,
      time: Date.now()
    };

    this.balls.push(ball);
  }

  /**
   * Generates a random color for the balls.
   *
   * @returns {string}
   * @memberof AppComponent
   */
  generateColor(): string {
    const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    return color;
  }

  /**
   * Generates a random size for the ball between 50px and 100px.
   *
   * @returns {number}
   * @memberof AppComponent
   */
  generateSize(): number {
    const size = Math.floor(Math.random() * (100 - 50) + 50);
    return size;
  }
}
