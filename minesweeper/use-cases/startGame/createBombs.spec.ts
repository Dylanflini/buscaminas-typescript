import { createBombs } from './createBombs';

describe('create bombs in board', () => {
  it('should create 1 bomb', () => {
    const props = { bombsInput: 1, rows: 2, columns: 2 };

    const bombs = createBombs(props);
    // hay que tener ojo porque al ser random puede que en algunas ocasiones pase y otras no,
    // pero no se como evitar eso en el test

    // ver que no sean bombas vacias
    expect(bombs[0].position).toBeTruthy();

    const [x, y] = bombs[0].position;

    expect(x).toBeGreaterThanOrEqual(0);
    expect(x).toBeLessThan(props.rows);

    expect(y).toBeGreaterThanOrEqual(0);
    expect(y).toBeLessThan(props.columns);
  });

  it('The bombs shouldn"t have the same position that other bombs', () => {
    const props = { bombsInput: 2, columns: 3, rows: 2 };

    const bombs = createBombs(props);

    // ver que no sean bombas vacias
    expect(bombs[0].position).toBeTruthy();

    const match = bombs.some((bomb, bombIndex) => {
      const [bombX, bombY] = bomb.position;
      return bombs.some(({ position }, index) => {
        const [x, y] = position;
        return x === bombX && y === bombY && bombIndex !== index;
      });
    });

    expect(match).toBe(false);
  });
});
