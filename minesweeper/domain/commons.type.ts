/**
 * Utility Types
 */

export type TPosition = [number, number];

export interface IPosition {
  position: TPosition;
}

export type IBoardId = {
  id: string;
};

export interface WithBoardId {
  boardId: IBoardId;
}
