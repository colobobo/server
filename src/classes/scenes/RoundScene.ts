import { events, Members, payloads, enums, PlayerRoles, PlayerRole } from '@colobobo/library';
import { Scene } from '@/types';
import { gameProperties } from '@/config/game-properties';
import { Game, History, Player, Room } from '@/classes';
import { emitGlobal, getRandomArrayElement, shuffle } from '@/utils';

export class RoundScene implements Scene {
  history: History;
  room: Room;
  game: Game;
  id = 0;
  interval: NodeJS.Timeout;

  duration = gameProperties.variables.duration.defaultValue;
  trapInterval = gameProperties.variables.traps.defaultInterval;
  world: enums.World;
  members: Members = {};

  constructor(room: Room, game: Game) {
    this.game = game;
    this.room = room;
    this.history = new History();
  }

  init() {
    this.id++;

    const duration = this.firstRoundCheck(
      this.duration,
      Math.round(this.duration * gameProperties.variables.duration.decreaseCoefficient),
    );
    const playerRoles: PlayerRoles = {};
    const playerIds = Array.from(this.room.players.keys());
    const skins = shuffle(Object.values(enums.member.Skins));
    const world: enums.World = getRandomArrayElement(Object.values(enums.World));

    this.duration = duration;
    this.world = world;

    for (let i = 0; i < gameProperties.members; i++) {
      this.members[`member-${i + 1}`] = {
        isDrag: false,
        skin: skins[i],
        status: enums.member.Status.waiting,
        manager: null,
        position: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
      };
    }

    const availablePlayerRoles = this.availablePlayerRoles;
    for (let i = 0; i < playerIds.length; i++) {
      playerRoles[playerIds[i]] = availablePlayerRoles[i];
    }

    console.log(events.round.init);
    emitGlobal<payloads.round.Init>({
      roomId: this.room.id,
      eventName: events.round.init,
      data: {
        id: this.id,
        tick: gameProperties.tick,
        members: this.members,
        playerRoles,
        duration,
        world,
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

    // TODO: Start timer based on this.duration value to trigger this.fail()
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
    this.clear();
    this.game.switchToScene(enums.scene.Type.transition);
    this.game.transitionScene.init();
    // TODO: Add to history
    // TODO: Emit event
  }

  clear() {
    console.log('CLEAR ROUND SCENE');
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

  firstRoundCheck(defaultValue: any, updatedValue: any) {
    return this.id === 1 ? defaultValue : updatedValue;
  }

  get availablePlayerRoles(): PlayerRole[] {
    const trapInterval = this.firstRoundCheck(
      this.trapInterval,
      Math.round(this.trapInterval * gameProperties.variables.traps.decreaseCoefficient),
    );
    const playerRoles = [
      {
        role: enums.player.Role.platform,
        properties: { direction: getRandomArrayElement(Object.values(enums.round.Direction)) },
      },
      {
        role: enums.player.Role.trap,
        properties: { type: getRandomArrayElement(Object.values(enums.Traps[this.world])), interval: trapInterval },
      },
    ];

    const maxTrapsToAdd = this.room.players.size - playerRoles.length;
    const difficultySteps = Math.floor(this.id / gameProperties.difficultyStep);
    const trapsToAdd = difficultySteps > maxTrapsToAdd ? maxTrapsToAdd : difficultySteps;
    const offset = playerRoles.length + trapsToAdd;
    const blanksToAdd = this.room.players.size - offset;

    this.trapInterval = trapInterval;

    for (let i = 0; i < trapsToAdd; i++) {
      playerRoles.push({
        role: enums.player.Role.trap,
        properties: { type: getRandomArrayElement(Object.values(enums.Traps[this.world])), interval: trapInterval },
      });
    }

    for (let i = 0; i < blanksToAdd; i++) {
      playerRoles.push({
        role: enums.player.Role.blank,
        properties: null,
      });
    }

    return shuffle(playerRoles);
  }
}
