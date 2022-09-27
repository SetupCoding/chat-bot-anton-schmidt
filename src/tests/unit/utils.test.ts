import type { Step } from '../../models';
import { getStepById } from '../../utils';

const elementOne = { id: 1 };
const elementTwo = { id: 2 };
const flow = [elementOne, elementTwo] as Step[];

describe('getStepById()', () => {
  it('should return undefined if id is a boolean', () => {
    expect(getStepById(true, flow)).toBeUndefined();
    expect(getStepById(false, flow)).toBeUndefined();
  });

  it('should return object with correct id', () => {
    expect(getStepById(1, flow)).toBe(elementOne);
    expect(getStepById(2, flow)).toBe(elementTwo);
  });

  it('should return undefined if provided array is empty', () => {
    expect(getStepById(0, [])).toBeUndefined();
    expect(getStepById(1, [])).toBeUndefined();
    expect(getStepById(20, [])).toBeUndefined();
  });
});
