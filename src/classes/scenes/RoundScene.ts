import { events, Members, payloads, enums } from '@colobobo/library';
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
  world: enums.World = enums.World.jungle;

  constructor(room: Room, game: Game) {
    this.id = 1;
    this.game = game;
    this.history = new History();
    this.room = room;
  }

  init() {
    this.members = {
      'member-1': {
        position: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
        width: 180,
        height: 180,
        color: '#ffe136',
        manager: '',
      },
      'member-2': {
        position: { x: 0, y: 150 },
        velocity: { x: 0, y: 0 },
        width: 130,
        height: 130,
        color: '#ff7ade',
        manager: '',
      },
      'member-3': {
        position: { x: 0, y: 250 },
        velocity: { x: 0, y: 0 },
        width: 100,
        height: 100,
        color: '#3ced7e',
        manager: '',
      },
      'member-4': {
        position: { x: 0, y: 250 },
        velocity: { x: 0, y: 0 },
        width: 100,
        height: 100,
        color: '#3ced7e',
        manager: '',
      },
      'member-5': {
        position: { x: 0, y: 250 },
        velocity: { x: 0, y: 0 },
        width: 100,
        height: 100,
        color: '#3ced7e',
        manager: '',
      },
      'member-6': {
        position: { x: 0, y: 250 },
        velocity: { x: 0, y: 0 },
        width: 100,
        height: 100,
        color: '#3ced7e',
        manager: '',
      },
    };
    emitGlobal<payloads.round.Init>({
      roomId: this.room.id,
      eventName: events.round.init,
      data: {
        id: this.id,
        world: this.world,
        duration: 30,
        tick: gameProperties.tick,
        playerRoles: {}, // TODO: Add loop to define roles
      },
    });
  }

  playerReady(player: Player) {
    player.isReady = true;
    // TODO: If all ready => start round
    this.start();
  }

  start() {
    this.interval = setInterval(this.tick.bind(this), gameProperties.tick);
    emitGlobal<payloads.round.Start>({ roomId: this.room.id, eventName: events.round.start });
  }

  fail() {
    if (this.game.life > 0) this.game.removeLife();
    this.end();
    emitGlobal<payloads.round.Fail>({ roomId: this.room.id, eventName: events.round.fail, data: {} });
  }

  success() {
    this.game.score++;
    this.end();
    emitGlobal<payloads.round.Success>({ roomId: this.room.id, eventName: events.round.success, data: {} });
  }

  end() {
    this.incrementDifficulty();
    this.clear();
    this.game.switchToScene(enums.scene.Type.transition);
    this.game.transitionScene.init();
    // TODO: Emit event
  }

  clear() {
    clearInterval(this.interval);
  }

  tick() {
    emitGlobal<payloads.round.Tick>({
      roomId: this.room.id,
      eventName: events.round.tick,
      data: {
        members: this.members,
      },
    });
  }

  memberSpawned(payload: payloads.round.MemberSpawned) {
    console.log(events.round.memberSpawned, payload);
    // TODO: Add member into `members` object
  }

  memberDragStart(payload: payloads.round.MemberDragStart) {
    console.log(events.round.memberDragStart, payload);
    // TODO: Update member status
    this.members[payload.memberId].manager = payload.playerId;
  }

  memberDragEnd(payload: payloads.round.MemberDragEnd) {
    console.log(events.round.memberDragEnd, payload);
    // TODO: Update member status
  }

  memberMove(payload: payloads.round.MemberMove) {
    console.log(events.round.memberMove, payload.id);
    this.members[payload.id].position = payload.position;
    this.members[payload.id].velocity = payload.velocity;
  }

  memberTrapped(payload: payloads.round.MemberTrapped) {
    console.log(events.round.memberTrapped, payload);
    // TODO: Update member status
  }

  memberDropped(payload: payloads.round.MemberDropped) {
    console.log(events.round.memberDropped, payload);
    // TODO: Update member status
    // TODO: this.fail()
  }

  memberArrived(payload: payloads.round.MemberArrived) {
    console.log(events.round.memberArrived, payload);
    // TODO: Update member status
    // TODO: If last to arrive => this.success()
    this.success();
  }

  incrementDifficulty() {
    this.id = this.id + 1;
    // TODO: Increment difficulty
  }
}
