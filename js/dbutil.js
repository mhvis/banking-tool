// vim: expandtab softtabstop=2 shiftwidth=2

export default {
  /**
   * Filters for real transactions, discards savings accounts or others.
   */
  filterOutbound(dbRows) {
    return dbRows.filter(function() {
      return !this.name.startsWith('VAN') && !this.name.startsWith('NAAR');
    });
  }
};
