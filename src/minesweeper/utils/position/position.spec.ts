import { TPosition } from '@minesweeper/domain/models/Position.model';
import { hasSamePosition } from './position';

describe('Position util', () => {
  it('getSamePosition', () => {
    const validPosition: TPosition = [10, 5];
    const invalidPosition: TPosition = [7, 3];

    expect(hasSamePosition([10, 5], validPosition)).toBeTruthy();
    expect(hasSamePosition([10, 5], invalidPosition)).toBeFalsy();
  });
});
