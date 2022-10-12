export enum PositionErrorMessages {
  BODY_EMPTY = 'Must send data in the body',

  BODY_WITHOUT_POSITION_PROPERTY = 'Must send position property in the body',
  BODY_POSITION_NOT_ARRAY = 'Must send position property as an array',
  BODY_POSITION_NOT_TWO_ELEMENTS = 'Must send two elements in position property',
  BODY_POSITION_ELEMENTS_ARE_NOT_NUMBERS = 'Must send position property elements as numbers',

  NOT_BOARD_ID = 'Must provide id of board to play',
  BOARD_ID_NOT_STRING = 'Must provide a board id as string',
}
