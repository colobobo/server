import {
  events,
  Members,
  payloads,
  enums,
  PlayerRoles,
  PlayerRole,
  round,
  PlayerRolePropertiesPlateform,
  PlayerRolePropertiesTrap,
} from '@colobobo/library';
import { Scene } from '@/types';
import { gameProperties } from '@/config/game-properties';
import { Game, History, Player, Room } from '@/classes';
import { emitGlobal, getRandomArrayElement, shuffle } from '@/utils';

export class RoundScene implements Scene {
  history: History;
  room: Room;
  game: Game;
  id = 0;
  successes = 0;
  tick: NodeJS.Timeout;
  timer: NodeJS.Timeout;

  startTimestamp: Date;
  playedIntervals: number[] = [];

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
        lives: this.game.lives,
        members: this.members,
        score: this.game.score,
        playerRoles,
        duration,
        world,
      },
    });
  }

  playerReady(player: Player) {
    console.log(events.round.playerReady, player.id);
    player.isReady = true;
    if (Array.from(this.room.players.values()).every(player => player.isReady)) this.start();
  }

  start() {
    console.log(events.round.start);
    emitGlobal<payloads.round.Start>({
      roomId: this.room.id,
      eventName: events.round.start,
      data: {
        endRoundTimeStamp: new Date().getTime() + this.duration,
      },
    });
    this.tick = setInterval(this.emitTick.bind(this), gameProperties.tick);
    this.timer = setTimeout(this.fail.bind(this), this.duration);
    this.startTimestamp = new Date();
  }

  restart() {
    this.tick = setInterval(this.emitTick.bind(this), gameProperties.tick);
    this.timer = setTimeout(this.fail.bind(this), this.remainingTime);
    this.startTimestamp = new Date();
  }

  stop() {
    clearInterval(this.tick);
    clearTimeout(this.timer);
    const elapsedTime = new Date().getTime() - this.startTimestamp.getTime();
    this.playedIntervals.push(elapsedTime);
  }

  fail() {
    this.stop();
    if (this.game.lives > 0) this.game.lives--;

    const gameData = { ...this.information, endType: enums.game.EndType.fail };
    emitGlobal<payloads.round.Fail>({ roomId: this.room.id, eventName: events.round.fail, data: gameData });
    this.history.push(gameData);
    this.end();
  }

  success() {
    this.stop();
    this.game.score++;
    this.successes++;

    const gameData = { ...this.information, endType: enums.game.EndType.success };
    emitGlobal<payloads.round.Success>({
      roomId: this.room.id,
      eventName: events.round.success,
      data: gameData,
    });
    this.history.push(gameData);
    this.end();
  }

  updateStatus({ status }: payloads.round.StatusUpdate) {
    console.log(events.round.statusUpdate, status);

    if (status === enums.round.Status.play) this.restart();
    if (status === enums.round.Status.pause) this.stop();

    emitGlobal<payloads.round.StatusUpdateSuccess>({
      roomId: this.room.id,
      eventName: events.round.statusUpdateSuccess,
      data: {
        status,
        endRoundTimeStamp: new Date().getTime() + this.remainingTime,
      },
    });
  }

  end() {
    // TODO: Add event & remove success + fail
    this.clear();
    this.game.switchToScene(enums.scene.Type.transition);
    this.game.transitionScene.init();
  }

  clear() {
    console.log('CLEAR ROUND SCENE');
    this.room.players.forEach(player => (player.isReady = false));
    this.playedIntervals = [];
    this.world = null;
  }

  emitTick() {
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
    const { memberId } = payload;
    this.members[memberId].status = enums.member.Status.active;
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
    const { memberId } = payload;
    this.members[memberId].status = enums.member.Status.waiting;
  }

  memberDropped(payload: payloads.round.MemberDropped) {
    console.log(events.round.memberDropped, payload);
    // TODO: Update member status
    // TODO: this.fail()
  }

  memberArrived(payload: payloads.round.MemberArrived) {
    console.log(events.round.memberArrived, payload);
    const { memberId } = payload;
    this.members[memberId].status = enums.member.Status.arrived;
    const membersArray = Object.values(this.members);
    // if all members are arrived -> success
    if (membersArray.every(member => member.status === enums.member.Status.arrived)) {
      this.success();
    }
  }

  firstRoundCheck(defaultValue: any, updatedValue: any) {
    return this.id === 1 ? defaultValue : updatedValue;
  }

  get availablePlayerRoles(): PlayerRole[] {
    const trapInterval = this.firstRoundCheck(
      this.trapInterval,
      Math.round(this.trapInterval * gameProperties.variables.traps.decreaseCoefficient),
    );
    const playerRoles: PlayerRole[] = [
      {
        role: enums.player.Role.platform,
        properties: {
          direction: getRandomArrayElement(Object.values(enums.round.Direction)),
        } as PlayerRolePropertiesPlateform,
      },
    ];

    const maxTrapsToAdd = this.room.players.size - playerRoles.length;
    const difficultySteps = Math.floor(this.successes / gameProperties.difficultyStep);
    const trapsToAdd = difficultySteps > maxTrapsToAdd ? maxTrapsToAdd : difficultySteps;
    const offset = playerRoles.length + trapsToAdd;
    const blanksToAdd = this.room.players.size - offset;

    this.trapInterval = trapInterval;

    for (let i = 0; i < trapsToAdd; i++) {
      playerRoles.push({
        role: enums.player.Role.trap,
        properties: {
          type: getRandomArrayElement(Object.values(enums.Traps[this.world])),
          interval: trapInterval,
        } as PlayerRolePropertiesTrap,
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

  get elapsedTime() {
    return this.playedIntervals.reduce((accumulator, currentValue) => accumulator + currentValue);
  }

  get remainingTime() {
    return this.duration - this.elapsedTime;
  }

  get information(): round.Information {
    return {
      id: this.id,
      duration: this.duration,
      elapsedTime: this.elapsedTime,
      members: this.members,
      score: this.game.score,
      lives: this.game.lives,
      world: this.world,
    };
  }
}
