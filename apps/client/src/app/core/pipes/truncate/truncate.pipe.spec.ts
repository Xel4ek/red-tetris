import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  const pipe = new TruncatePipe();
  it('truncate "less then max"', () => {
    expect(pipe.transform('wow', 4)).toEqual('wow');
  });

  it('truncate "more then max"', () => {
    expect(pipe.transform('so long', 2)).toEqual('so...');
  });
});
