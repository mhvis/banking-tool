var React = require('react');
var ReactDOM = require('react-dom');
// Hack below
var Taffy = require('../node_modules/taffy/lib/taffy.js').taffy;
var Papa = require('papaparse');
var Util = require('./util');

// Config
var mutationTypes = {
  "Internetbankieren": "internet_banking",
  "Betaalautomaat": "payment_terminal",
  "Geldautomaat": "atm",
  "Incasso": "collection",
  "Verzamelbetaling": "collect_payment",
  "Overschrijving": "transfer"
};
// Database name is used for localStorage
var dbName = 'transactions';

var InputCSVText = React.createClass({
  propTypes: {
    db: React.PropTypes.func.isRequired,
    onDbUpdate: React.PropTypes.func.isRequired
  },
  getInitialState: function() {
    return {value: ''};
  },
  handleChange: function(event) {
    this.setState({value: event.target.value});
  },
  readInput: function(event) {
    // Parse CSV
    var parseResult = Papa.parse(this.state.value);
    //console.log(parseResult);

    // Store CSV in database
    var db = this.props.db;
    parseResult.data.forEach(function(value, index, array) {
      if (index == 0) {
        // Skip header
        return;
      }
      var id = index - 1;
      var dateStr = value[0];
      var date = new Date(dateStr.substr(0, 4), dateStr.substr(4, 2), dateStr.substr(6, 2));
      var name = value[1];
      var bankNr = value[2];
      var otherBankNr = value[3];
      var code = value[4];
      var inOut;
      switch (value[5]) {
        case "Af":
          inOut = "out";
          break;
        case "Bij":
          inOut = "in";
          break;
        default:
          throw new Error("Invalid in/out (Af/Bij) value: " + value[5]);
      }
      var amount = parseFloat(value[6].replace(',', '.'));
      var mutationType = mutationTypes[value[7]];
      if (!mutationType) {
        throw new Error("Invalid mutation type: " + value[7]);
      }
      var message = value[8];
      // Insert in database
      var row = {
        id: id,
        date: date.getTime(),
        name: name,
        bankNr: bankNr,
        otherBankNr: otherBankNr,
        code: code,
        inOut: inOut,
        amount: amount,
        mutationType: mutationType,
        message: message
      }
      db.insert(row);
    });
    db.sort('date');
    this.props.onDbUpdate();
  },
  render: function() {
    return (
      <div>
        <p>The text area expects an ING CSV-file with transactions.</p>
        <textarea value={this.state.value} onChange={this.handleChange} rows="20" cols="80"/>
        <button type="button" onClick={this.readInput}>Do something</button>
      </div>
    );
  }
});

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
      str += ' ' + record.code + ' ' + record.inOut + ' ' + record.amount;
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
    var totalIn = db({inOut: 'in'}).sum('amount');
    var totalOut = db({inOut: 'out'}).sum('amount');
    var monthlyIn = totalIn / monthDifference;
    var monthlyOut = totalOut / monthDifference;
    return (
      <div>
        <h3>Average monthly income/outcome</h3>
        <p>
          <span>Income: {monthlyIn}</span><br/>
          <span>Outcome: {monthlyOut}</span>
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
})

var App = React.createClass({
  dbUpdate: function() {
    this.setState({db: this.state.db});
  },
  clearDb: function() {
    this.state.db().remove();
    this.setState({db: this.state.db});
  },
  getInitialState: function() {
    var db = Taffy();
    db.store(dbName);
    return {db: db};
  },
  render: function() {
    return (
      <div>
        <button type="button" onClick={this.clearDb}>Clear database</button>
        <InputCSVText db={this.state.db} onDbUpdate={this.dbUpdate}/>
        <TransactionText db={this.state.db}/>
        <MonthlyAverage db={this.state.db}/>
      </div>
    );
  }
});

ReactDOM.render(
  <App/>, document.getElementById('app'));
