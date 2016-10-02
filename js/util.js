module.exports = {
  // Does 'last' - 'first' and returns the number of months in between.
  // Result is negative if 'last' is earlier than 'first'.
  getMonthDifference: function(last, first) {
    var yearDifference = last.getYear() - first.getYear();
    var monthDifference = last.getMonth() - first.getMonth();
    return 12 * yearDifference + monthDifference;
  }
}
