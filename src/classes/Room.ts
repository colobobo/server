import { events, payloads, enums } from '@colobobo/library';
import { PlayerInterface, RoomInterface } from '@/types';
import { Game } from '@/classes';

export class Room implements RoomInterface {
  id: string;
  players: Map<string, PlayerInterface>;
  game: Game;

  constructor(id: string) {
    this.id = id;
    this.players = new Map();
    this.game = new Game(this);
  }

  addPlayer(player: PlayerInterface) {
    this.players.set(player.id, player);
    if (player.isCreator) this.initCreatorEventListeners(player);
    this.initEventListeners(player);
  }

  initCreatorEventListeners(player: PlayerInterface) {
    player.socket.on(events.game.start, () => this.game.start());
    player.socket.on(events.transition.ended, () => this.game.transitionScene.end());
  }

  initEventListeners(player: PlayerInterface) {
    player.socket.on(events.player.ready, () => this.game.roundScene.playerReady(player));

    player.socket.on(events.transition.playerReady, () => this.game.transitionScene.playerReady(player));
    player.socket.on(events.round.playerReady, () => this.game.roundScene.playerReady(player));

    player.socket.on(events.round.memberSpawned, (payload: payloads.round.MemberSpawned) =>
      this.game.roundScene.memberSpawned(payload),
    );
    player.socket.on(events.round.memberDragStart, (payload: payloads.round.MemberDragStart) =>
      this.game.roundScene.memberDragStart(payload),
    );
    player.socket.on(events.round.memberDragEnd, (payload: payloads.round.MemberDragEnd) =>
      this.game.roundScene.memberDragEnd(payload),
    );
    player.socket.on(events.round.memberMove, (payload: payloads.round.MemberMove) =>
      this.game.roundScene.memberMove(payload),
    );
    player.socket.on(events.round.memberTrapped, (payload: payloads.round.MemberTrapped) =>
      this.game.roundScene.memberTrapped(payload),
    );
    player.socket.on(events.round.memberDropped, (payload: payloads.round.MemberDropped) =>
      this.game.roundScene.memberDropped(payload),
    );
    player.socket.on(events.round.memberArrived, (payload: payloads.round.MemberArrived) =>
      this.game.roundScene.memberArrived(payload),
    );

    player.socket.on('disconnect', () => {
      player.status = enums.player.Status.absent;
      // TODO: Set global status to pause

      if (!this.roomActive) {
        this.game.kill();
        global.rooms.delete(this.id);
      }
    });
  }

  get roomActive() {
    let roomActive = false;

    Array.from(this.players.values()).forEach(player => {
      if (player.status === 'active') roomActive = true;
    });

    return roomActive;
  }
}
