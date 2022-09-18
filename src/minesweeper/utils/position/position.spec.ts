import { IPosition } from '@minesweeper/lib/types';
import { getSamePosition } from './position';

describe('Position util', () => {
  it('getSamePosition', () => {
    const samePosition = getSamePosition(10, 5);

    const validPosition: IPosition = {
      position: [10, 5],
    };

    const invalidPosition: IPosition = {
      position: [7, 3],
    };

    expect(samePosition(validPosition)).toBeTruthy();
    expect(samePosition(invalidPosition)).toBeFalsy();
  });
});
