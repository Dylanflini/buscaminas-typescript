import { IPosition } from '@minesweeper/domain/models';
import { hasSamePosition } from './position';

describe('Position util', () => {
  it('getSamePosition', () => {
    const validPosition: IPosition = { position: [10, 5] };
    const invalidPosition: IPosition = { position: [7, 3] };

    expect(hasSamePosition({ position: [10, 5] }, validPosition)).toBeTruthy();
    expect(hasSamePosition({ position: [10, 5] }, invalidPosition)).toBeFalsy();
  });
});
