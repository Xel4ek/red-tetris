import { KeysPipe } from './keys.pipe';

describe('KeysPipe', () => {
  const pipe = new KeysPipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  it('test object', () => {
    expect(
      pipe.transform({ test: {}, test2: 'some string', test3: 42 })
    ).toEqual(['test', 'test2', 'test3']);
  });
  it('should null', () => {
    expect(pipe.transform(undefined)).toBeNull();
  });
});
