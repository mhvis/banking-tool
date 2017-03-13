// vim: expandtab softtabstop=2 shiftwidth=2
'use strict';

import React from 'react';
import moment from 'moment';
import {DateRange} from 'react-date-range';

export default class RangeSlider extends React.Component {
  handleSelect(range) {
    let {startDate, endDate} = range;
    // Skip if startDate equals endDate
    if (startDate.isSame(endDate)) {
      return;
    }

    let dbView = this.props.db().filter({
      date: {
        gte: startDate.valueOf(),
        lte: endDate.valueOf()
      }
    });
    this.props.onDbView(dbView);
  }

  render() {
    if (this.props.db().get().length == 0) {
      return <div></div>;
    }

    let startDate = moment(this.props.db().first().date);
    let endDate = moment(this.props.db().last().date);

    let ranges = {
      'Laatste maand': {
        startDate: endDate.clone().subtract(1, 'months'),
        endDate
      },
      'Laatste jaar': {
        startDate: endDate.clone().subtract(1, 'years'),
        endDate
      },
      'Laatste 2 jaar': {
        startDate: endDate.clone().subtract(2, 'years'),
        endDate
      },
      'Alles': {
        startDate,
        endDate
      }
    };

    return <div>
      <h2>Datumbereik</h2>
      <p>Hier kan een datumbereik ingesteld worden dat gebruikt wordt voor de grafieken.</p>
      <DateRange startDate={startDate} endDate={endDate}
        onChange={this.handleSelect.bind(this)} ranges={ranges} />
    </div>;
  }
}
RangeSlider.propTypes = {
  db: React.PropTypes.func.isRequired,
  onDbView: React.PropTypes.func.isRequired
};
