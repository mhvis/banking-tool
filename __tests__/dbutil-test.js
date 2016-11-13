// vim: expandtab softtabstop=2 shiftwidth=2

import DbUtil from '../js/dbutil';
import {taffy as Taffy} from 'taffy/lib/taffy';

var template = {
  amount: -5,
  bankNr: 'NL12INGB3456789012',
  code: 'BA',
  date: new Date(),
  id: 0,
  message: 'Hallo',
  mutationType: 'Betaalautomaat',
  name: 'Name',
  otherBankNr: 'NL12INGB3467890123',
  timestamp: Date.now()
};

describe('filter outbound', () => {
  let db, el;

  beforeEach(() => {
    db = Taffy();
    el = Object.assign({}, template);
  });

  it('does not filter normal names', () => {
    el.name = 'Normal name';
    db.insert(el);
    let resultRows = DbUtil.filterOutbound(db());
    expect(resultRows.get().length).toBe(1);
  });

  it('filters names starting with VAN', () => {
    el.name = 'VAN spaarrekening';
    db.insert(el);
    let resultRows = DbUtil.filterOutbound(db());
    expect(resultRows.get().length).toBe(0);
  });

  it('filters names starting with NAAR', () => {
    el.name = 'NAAR spaarrekening';
    db.insert(el);
    let resultRows = DbUtil.filterOutbound(db());
    expect(resultRows.get().length).toBe(0);
  });
});
