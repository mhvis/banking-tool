import React from 'react';
import Plotly from 'react-plotlyjs';
import DbUtil from './dbutil';

var codeColors = {
  AC: 'E100CD',
  BA: 'FF9900',
  DV: '006DDE',
  FL: 'CBFB00',
  GF: 'FF2800',
  GM: 'FFDF00',
  GT: '00E64E',
  IC: '4F001E',
  OV: '2C00E1',
  PK: 'FE0007',
  PO: '0CED00',
  ST: 'FFCF00',
  VZ: '0071DE'
};

// Object.values shim/polyfill
Object.values = Object.values || (obj => Object.keys(obj).map(key => obj[key]));

class CashPlot extends React.Component {
  render() {
    let dbRows = this.props.dbRows;

    let x = dbRows.map((record, recordnumber) => new Date(record.date));
    let y = [];
    dbRows.get().reduce((prev, curr, index) => y[index] = prev + curr.amount, 0);

    let text = dbRows.map((record, recordnumber) =>
        record.amount + ' ' + record.name + ' ' + record.message);
    
    let cashTrace = {
      x,
      y,
      text,
      type: 'scatter'
    };
    /*
    let timelineItems = this.props.db().map((record, recordNr) => {
      return {
        content: record.amount + '',
        id: record.id, 
        start: record.date,
        style: 'background-color: #' + codeColors[record.code],
        title: record.name + ' ' + record.message
      };
    });
    */
    let data = [cashTrace];
    let layout = {
      title: 'Vermogen'
    };

    return <Plotly data={data} layout={layout} />
  }
}
CashPlot.propTypes = {
  dbRows: React.PropTypes.object.isRequired
};

/**
 * Extra string function to filter special characters.
 */
String.prototype.filterSpecialChars = function() {
  return this.replace(/[^a-zA-Z ]/g, "").trim();
};

class PieCombine extends React.Component {
  render() {
    // Create data by combining name values
    let combine = {};
    this.props.dbRows.each((record, recordnumber) => {
      let name = record.name.filterSpecialChars();
      if (!combine.hasOwnProperty(name)) {
        combine[name] = 0;
      }
      combine[name] += Math.abs(record.amount);
    });
    let pie = {
      values: Object.values(combine),
      labels: Object.keys(combine),
      type: 'pie'
    }
    let data = [pie];

    let layout = {
      title: this.props.title
    };

    return <Plotly data={data} layout={layout} />
  }
}
PieCombine.propTypes = {
  dbRows: React.PropTypes.object.isRequired,
  title: React.PropTypes.string
};

export default class Visuals extends React.Component {
  render() {
    let empty = this.props.dbRows.get().length == 0;
    let content;
    if (empty) {
      content = <p>Nog geen data opgegeven, selecteer data hierboven.</p>;
    } else {
      let dbRows = DbUtil.filterOutbound(this.props.dbRows);
      let income = dbRows.filter({amount: {gt: 0}});
      let outcome = dbRows.filter({amount: {lt: 0}});
      content = <div>
        <CashPlot dbRows={dbRows} />
        <PieCombine dbRows={income} title='Inkomsten' />
        <PieCombine dbRows={outcome} title='Uitgaven' />
      </div>;
    }
    return <div>
      <h2>Grafiekjes</h2>
      {content}
    </div>;
  }
}
Visuals.propTypes = {
  dbRows: React.PropTypes.object.isRequired
};
