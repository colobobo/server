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
import { gameProperties } from '@/config/game-properties';
import { Game, History, Player, Room } from '@/classes';
import { emitGlobal, getRandomArrayElement, shuffle } from '@/utils';

export class RoundScene {
  history: History;
  room: Room;
  game: Game;
  id = 0;
  successes = 0;
  tick: NodeJS.Timeout;
  timer: NodeJS.Timeout;

  startTimestamp: Date;
  playedIntervals: number[] = [];

  duration: number = undefined;
  trapInterval: number = undefined;
  world: enums.World;
  members: Members = {};

  arrivedMembers: round.ScoreDetail = { value: 0, points: 0 };
  traps: round.ScoreDetail = { value: 0, points: 0 };

  constructor(room: Room, game: Game) {
    this.game = game;
    this.room = room;
    this.history = new History();
  }

  init() {
    this.id++;

    if (this.isFirstRound) {
      this.duration = gameProperties.variables[this.room.players.size].duration.defaultValue;
      this.trapInterval = gameProperties.variables[this.room.players.size].traps.defaultInterval;
    }

    console.log('SUCCESSES', this.successes);
    const duration = this.history.isLastRoundSuccess
      ? this.firstRoundCheck(
          this.duration,
          // TODO: Use Math.pow()?
          Math.round(this.duration * gameProperties.variables[this.room.players.size].duration.decreaseCoefficient),
        )
      : this.duration;
    const playerRoles: PlayerRoles = {};
    const playerIds = Array.from(this.room.players.keys());
    const skins = shuffle(Object.values(enums.member.Skins));
    const world: enums.World = getRandomArrayElement(Object.values(enums.World));

    this.duration = duration;
    this.world = world;

    const availableMembers = this.availableMembers;
    for (let i = 0; i < availableMembers; i++) {
      this.members[`member-${i + 1}`] = {
        isDragged: false,
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

    console.log(events.round.init, duration, playerRoles);
    emitGlobal<payloads.round.Init>({
      roomId: this.room.id,
      eventName: events.round.init,
      data: {
        id: this.id,
        tick: gameProperties.tick,
        lives: this.game.lives,
        members: this.members,
        score: this.game.scoreValue,
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
    this.tick = setInterval(() => this.emitTick(), gameProperties.tick);
    this.timer = setTimeout(() => this.fail(enums.round.FailCauses.timer), this.duration);
    this.startTimestamp = new Date();
  }

  restart() {
    this.tick = setInterval(() => this.emitTick(), gameProperties.tick);
    this.timer = setTimeout(() => this.fail(enums.round.FailCauses.timer), this.remainingTime);
    this.startTimestamp = new Date();
  }

  stop() {
    clearInterval(this.tick);
    clearTimeout(this.timer);
    const elapsedTime = new Date().getTime() - this.startTimestamp.getTime();
    this.playedIntervals.push(elapsedTime);
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

  success() {
    this.stop();
    this.successes++;
    this.game.addScore(this.remainingTimeScore);
    this.end(enums.round.EndType.success, null);
  }

  fail(cause: enums.round.FailCauses) {
    this.stop();
    if (this.game.lives > 0) this.game.lives--;
    this.end(enums.round.EndType.fail, cause);
  }

  end(endType: enums.round.EndType, failCause: enums.round.FailCauses) {
    const isRoundSuccess = endType === enums.round.EndType.success;
    const roundTotalScore =
      this.arrivedMembers.points + this.traps.points + (isRoundSuccess ? this.remainingTimeScore : 0);
    const gameData: round.EndInformation = {
      endType,
      failCause,
      ...this.information,
      roundScore: {
        total: roundTotalScore,
        details: {
          arrivedMembers: this.arrivedMembers,
          ...(this.difficultySteps > 0 && { traps: this.traps }),
          ...(isRoundSuccess && {
            remainingTime: { value: this.remainingTime, points: this.remainingTimeScore },
          }),
        },
      },
    };
    emitGlobal<payloads.round.End>({
      roomId: this.room.id,
      eventName: events.round.end,
      data: gameData,
    });
    this.history.push(gameData);
    console.log(events.round.end, gameData);

    this.clear();
    this.game.switchToScene(enums.scene.Type.transition);
    this.game.transitionScene.init();
  }

  clear() {
    console.log('CLEAR ROUND SCENE');
    this.room.players.forEach(player => (player.isReady = false));
    this.arrivedMembers = { value: 0, points: 0 };
    this.traps = { value: 0, points: 0 };
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
    this.members[payload.memberId].isDragged = true;
    this.members[payload.memberId].status = enums.member.Status.active;
    this.members[payload.memberId].manager = payload.playerId;
  }

  memberDragEnd(payload: payloads.round.MemberDragEnd) {
    console.log(events.round.memberDragEnd, payload);
    this.members[payload.memberId].isDragged = false;
  }

  memberUpdateManager(payload: payloads.round.MemberUpdateManager) {
    this.members[payload.memberId].manager = payload.playerId;
  }

  memberMove(payload: payloads.round.MemberMove) {
    this.members[payload.id].position = payload.position;
    this.members[payload.id].velocity = payload.velocity;
  }

  memberTrapped(payload: payloads.round.MemberTrapped) {
    console.log(events.round.memberTrapped, payload);
    this.traps.value++;
    this.traps.points += gameProperties.score.memberTrapped;
    this.game.addScore(gameProperties.score.memberTrapped);
    this.members[payload.memberId].status = enums.member.Status.waiting;
  }

  memberDropped(payload: payloads.round.MemberDropped) {
    console.log(events.round.memberDropped, payload);
    this.members[payload.memberId].status = enums.member.Status.dropped;
    this.fail(enums.round.FailCauses.memberDropped);
  }

  memberArrived(payload: payloads.round.MemberArrived) {
    console.log(events.round.memberArrived, payload);
    this.arrivedMembers.value++;
    this.arrivedMembers.points += gameProperties.score.memberArrived;
    this.game.addScore(gameProperties.score.memberArrived);
    this.members[payload.memberId].status = enums.member.Status.arrived;
    const membersArray = Object.values(this.members);

    if (membersArray.every(member => member.status === enums.member.Status.arrived)) {
      this.success();
    }
  }

  firstRoundCheck(defaultValue: any, updatedValue: any) {
    return this.isFirstRound ? defaultValue : updatedValue;
  }

  get isFirstRound(): boolean {
    return this.id === 1;
  }

  get difficultySteps(): number {
    return Math.floor(this.successes / gameProperties.difficultyStep);
  }

  get availableMembers(): number {
    const stepMembers = gameProperties.members.min + this.difficultySteps;
    return stepMembers > gameProperties.members.max ? gameProperties.members.max : stepMembers;
  }

  get availablePlayerRoles(): PlayerRole[] {
    const playerRoles: PlayerRole[] = [
      {
        role: enums.player.Role.platform,
        properties: {
          direction: getRandomArrayElement(Object.values(enums.round.Direction)),
        } as PlayerRolePropertiesPlateform,
      },
    ];
    const maxTrapsToAdd = this.room.players.size - playerRoles.length;
    const trapsToAdd = this.difficultySteps > maxTrapsToAdd ? maxTrapsToAdd : this.difficultySteps;
    const offset = playerRoles.length + trapsToAdd;
    const blanksToAdd = this.room.players.size - offset;
    const trapInterval =
      trapsToAdd > 0 && this.successes === gameProperties.difficultyStep + 1 && this.history.isLastRoundSuccess
        ? this.firstRoundCheck(
            this.trapInterval,
            // TODO: Use Math.pow()?
            Math.round(this.trapInterval * gameProperties.variables[this.room.players.size].traps.decreaseCoefficient),
          )
        : this.trapInterval;

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

  get remainingTimeScore() {
    return Math.floor(this.remainingTime / 1000);
  }

  get information(): round.Information {
    return {
      id: this.id,
      duration: this.duration,
      elapsedTime: this.elapsedTime,
      members: this.members,
      gameScore: this.game.scoreValue,
      lives: this.game.lives,
      world: this.world,
    };
  }
}
