import { events, GameObjects, payloads, PlayerStatus } from '@colobobo/library';
import { gameProperties } from '@/config/game-properties';
import { Game, History, Player, Room } from '@/classes';
import { emitGlobal } from '@/utils';

export class Round {
  history: History;
  id: number;
  interval: any;
  objects: GameObjects;
  game: Game;
  room: Room;
  // TODO Add world

  constructor(room: Room, game: Game) {
    this.id = 1;
    this.game = game;
    this.history = new History();
    this.room = room;
  }

  init() {
    this.objects = {
      'object-1': {
        x: 0,
        y: 0,
        width: 180,
        height: 180,
        color: '#ffe136',
      },
      'object-2': {
        x: 0,
        y: 150,
        width: 130,
        height: 130,
        color: '#ff7ade',
      },
      'object-3': {
        x: 0,
        y: 250,
        width: 100,
        height: 100,
        color: '#3ced7e',
      },
    };
    // TODO: Emit init state
  }

  playerReady(player: Player) {
    player.status = PlayerStatus.ready;
    // TODO: If all ready => start round
  }

  start() {
    this.interval = setInterval(this.tick.bind(this), gameProperties.tick);
    emitGlobal({ roomId: this.room.id, eventName: events.round.start });
  }

  tick() {
    emitGlobal<payloads.game.Tick>({
      roomId: this.room.id,
      eventName: events.game.tick,
      data: {
        objects: this.objects,
        tick: gameProperties.tick,
      },
    });
  }

  memberSpawned() {
    // TODO: Add member into `members` object
  }

  memberDragStart() {
    // TODO: Update member status
  }

  memberDragEnd() {
    // TODO: Update member status
  }

  updatePosition({ x, y, id }: { x: number; y: number; id: string }) {
    this.objects[id].x = x;
    this.objects[id].y = y;
  }
  memberMove() {
    // TODO: Update position & remove `updatePosition`
  }

  memberTrapped() {
    // TODO: Update member status
  }

  memberDropped() {
    // TODO: Update member status
    // TODO: this.fail()
  }

  memberArrived() {
    // TODO: Update member status
    // TODO: If last to arrive => this.success()
  }

  incrementDifficulty() {
    this.id = this.id + 1;
    // TODO: Increment difficulty
  }

  success() {
    // TODO: Go to motion view
    // TODO: Push to history
  }

  fail() {
    if (this.game.life === 0) {
      this.kill();
      this.game.end();
    } else {
      this.game.removeLife();
    }

    // TODO: Push to history
    // TODO: Go to motion view
  }

  kill() {
    clearInterval(this.interval);
  }
}
