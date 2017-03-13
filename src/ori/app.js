import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import {taffy as Taffy} from 'taffy/lib/taffy';
import Util from './util';

import Input from './input';
import Visuals from './visuals';
import RangeSlider from './range-slider';

import './css/normalize.css';
import './css/skeleton.css';


/*
var TransactionText = React.createClass({
  propTypes: {
    db: React.PropTypes.func.isRequired
  },
  render: function() {
    var stringArr = this.props.db().map(function(record, recordNr) {
      var str = '';
      str += '(' + record.id + ') ';
      str += new Date(record.date).toDateString();
      str += '\n';
      str += record.name + ' ' + record.bankNr + ' ' + record.otherBankNr;
      str += ' ' + record.code + ' ' + record.amount;
      str += ' ' + record.mutationType + '\n';
      str += record.message;
      return str;
    });
    var string = stringArr.join('\n');
    return (
      <div>
        <textarea value={string} readOnly={true} rows="20" cols="80"/>
      </div>
    );
  }
});

var MonthlyAverage = React.createClass({
  propTypes: {
    db: React.PropTypes.func.isRequired
  },
  render: function() {
    var db = this.props.db;
    var firstDate = new Date(db().first().date);
    var lastDate = new Date(db().last().date);
    var monthDifference = Util.getMonthDifference(lastDate, firstDate);
    var total = db().sum('amount');
    var monthly = total / monthDifference;
    return (
      <div>
        <h3>Average monthly income/outcome</h3>
        <p>
          <span>{monthly}</span><br/>
        </p>
      </div>
    )
  }
});

var AddLabel = React.createClass({
  propTypes: {
    db: React.PropTypes.func.isRequired
  },
  render: function() {}
});
*/


class App extends React.Component {
  constructor(props) {
    super(props);
    var db = Taffy();
    db.store('transactions');
    this.state = {
      db: db,
      dbView: db()
    };
  }

  dbChanged() {
    this.setState({
      db: this.state.db,
      dbView: this.state.db()
    });
  }

  dbView(newView) {
    this.setState({
      dbView: newView
    });
  }

  render() {
    return (
      <div className='container'>
        <div className='row'>
          <div className='column' style={{marginTop: '10%'}}>
            <Card>
              <CardTitle title="Welkom" />
              <CardText>
                Deze site is nog in ontwikkeling, maar kan wel uitgeprobeerd worden. Als je ideeën of feedback hebt kun je dit laten weten via <a href="https://github.com/mhvis/banking-tool/issues/new">GitHub</a>. Een overzicht van functies waar op dit moment aan gewerkt wordt kan gevonden worden op de <a href="https://github.com/mhvis/banking-tool/projects/1">project pagina</a>.
              </CardText>
            </Card>
            <h1 style={{marginTop: '40px'}}>ING transactieoverzicht</h1>
            <p>
              Deze tool laat in de vorm van enkele grafiekjes een overzicht
              zien van inkomsten en uitgaven, op basis van een lijst
              transacties die geëxporteerd kunnen worden uit Mijn ING. Om te
              beginnen moet hieronder een bestand met transacties geselecteerd
              worden.
            </p>
            <p>
              De broncode van deze tool is te vinden
              op <a href="https://github.com/mhvis/ing-banking-tool">GitHub</a>.
            </p>
            <Input db={this.state.db} onDbChanged={this.dbChanged.bind(this)} />
            <RangeSlider db={this.state.db} onDbView={this.dbView.bind(this)} />
            <Visuals dbRows={this.state.dbView} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
