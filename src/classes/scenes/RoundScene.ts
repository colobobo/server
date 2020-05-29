import { events, Members, payloads, PlayerStatus } from '@colobobo/library';
import { Scene } from '@/types';
import { gameProperties } from '@/config/game-properties';
import { Game, History, Player, Room } from '@/classes';
import { emitGlobal } from '@/utils';

export class RoundScene implements Scene {
  history: History;
  id: number;
  interval: any;
  members: Members;
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
    this.members = {
      'member-1': {
        position: {
          x: 0,
          y: 0,
        },
        velocity: {
          x: 0,
          y: 0,
        },
        width: 180,
        height: 180,
        color: '#ffe136',
        manager: '',
      },
      'member-2': {
        position: {
          x: 0,
          y: 150,
        },
        velocity: {
          x: 0,
          y: 0,
        },
        width: 130,
        height: 130,
        color: '#ff7ade',
        manager: '',
      },
      'member-3': {
        position: {
          x: 0,
          y: 250,
        },
        velocity: {
          x: 0,
          y: 0,
        },
        width: 100,
        height: 100,
        color: '#3ced7e',
        manager: '',
      },
      'member-4': {
        position: {
          x: 0,
          y: 250,
        },
        velocity: {
          x: 0,
          y: 0,
        },
        width: 100,
        height: 100,
        color: '#3ced7e',
        manager: '',
      },
      'member-5': {
        position: {
          x: 0,
          y: 250,
        },
        velocity: {
          x: 0,
          y: 0,
        },
        width: 100,
        height: 100,
        color: '#3ced7e',
        manager: '',
      },
      'member-6': {
        position: {
          x: 0,
          y: 250,
        },
        velocity: {
          x: 0,
          y: 0,
        },
        width: 100,
        height: 100,
        color: '#3ced7e',
        manager: '',
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
    emitGlobal<payloads.round.Tick>({
      roomId: this.room.id,
      eventName: events.round.tick,
      data: {
        members: this.members,
        tick: gameProperties.tick,
      },
    });
  }

  memberSpawned() {
    // TODO: Add member into `members` object
  }

  memberDragStart(e: payloads.round.MemberDragStart) {
    // TODO: Update member status
    this.members[e.memberId].manager = e.playerId;
  }

  memberDragEnd() {
    // TODO: Update member status
  }

  memberMove(e: payloads.round.MemberMove) {
    this.members[e.id].position = e.position;
    this.members[e.id].velocity = e.velocity;
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
    this.game.score++;
    this.end();
  }

  fail() {
    if (this.game.life > 0) this.game.removeLife();
    this.end();
  }

  end() {
    this.incrementDifficulty();
    this.clear();
    this.game.switchToScene('transition');
    this.game.transitionScene.init();
    // TODO: Emit event
  }

  clear() {
    clearInterval(this.interval);
  }
}
