// vim: expandtab softtabstop=2 shiftwidth=2

import React from 'react';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import moment from 'moment';

require('moment/locale/nl');

var Item = React.createClass({
  propTypes: {
    date: React.PropTypes.any.isRequired,
    name: React.PropTypes.string.isRequired,
    bankNr: React.PropTypes.string.isRequired,
    otherBankNr: React.PropTypes.string.isRequired,
    code: React.PropTypes.string.isRequired,
    amount: React.PropTypes.number.isRequired,
    mutationType: React.PropTypes.string.isRequired,
    message: React.PropTypes.string.isRequired
  },
  render: function() {
    return (
      <TableRow></TableRow>
    );
  }
});

var TransactionsOverview = React.createClass({
  propTypes: {
  },
  render: function() {
    return (
      <Table></Table>
    );
  }
});

export default TransactionsOverview;
