import fs from 'fs';

export const fsMock = {
  writeFileSync: jest.spyOn(fs, 'writeFileSync'),
  readFileSync: jest.spyOn(fs, 'readFileSync'),
};
