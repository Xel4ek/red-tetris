import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  const pipe = new TruncatePipe();
  it('truncate "less then max"', () => {
    expect(pipe.transform('wow', 4)).toEqual('wow');
  });

  it('truncate "more then max"', () => {
    expect(pipe.transform('so long', 2)).toEqual('so...');
  });

  it('truncate no string', () => {
    expect(pipe.transform(123, 2)).toEqual(123);
  });
});
