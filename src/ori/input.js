import React from 'react';
import Papa from 'papaparse';

function store(results, db) {
  // Store CSV in database
  //db().remove(); // Clear database first
  results.data.forEach(function(value, id, array) {
    var dateStr = value['Datum'];
    var date = new Date(dateStr.substr(0, 4), dateStr.substr(4, 2), dateStr.substr(6, 2));
    var name = value['Naam / Omschrijving'];
    var bankNr = value['Rekening'];
    var otherBankNr = value['Tegenrekening'];
    var code = value['Code'];
    var amount = parseFloat(value['Bedrag (EUR)'].replace(',', '.'));
    if (value['Af Bij'] == "Af") {
      amount *= -1;
    }
    var mutationType = value['MutatieSoort'];
    var message = value['Mededelingen'];
    // Insert in database
    var row = {
      id: id,
      date: date.getTime(),
      name: name,
      bankNr: bankNr,
      otherBankNr: otherBankNr,
      code: code,
      amount: amount,
      mutationType: mutationType,
      message: message,
    }
    db.insert(row);
  });
  db.sort('date');
}

class CSVFileInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: ''};
  }

  fileInput() {
    var file = this.input.files[0];
    var that = this;
    if (!file) {
      this.setState({message: 'Geen bestand opgegeven.'});
      return;
    }
    Papa.parse(file, {
      complete: function(results, file) {
        try {
          store(results, that.props.db);
          that.props.dbChanged();
        } catch (e) {
          that.setState({message: 'Error occured while interpreting CSV: ' + e});
        }
      },
      error: function(error, file) {
        that.setState({message: 'Error occured while parsing CSV: ' + error});
      },
      header: true,
      skipEmptyLines: true
    });
  }

  render() {
    return <div>
      <h2>Selecteer transacties</h2>
      <ol>
        <li>
          In <a href="https://bankieren.mijn.ing.nl/particulier/overzichten/download/index" target="_blank">Mijn ING</a>,
          klik onder 'Overzichten' op 'Af- en bijschrijvingen downloaden'.
        </li>
        <li>Kies gewenste rekening, start datum en eind datum. Kies als bestandsformaat voor 'Kommagescheiden CSV'.</li>
        <li>Download de transacties.</li>
        <li>Selecteer hieronder het bestand en klik op 'Gebruik bestand'.</li>
      </ol>
      <input type="file" ref={input => this.input = input} accept="text/csv" />
      <br />
      <button type='button' className='button-primary' onClick={this.fileInput.bind(this)}>Gebruik bestand</button>
      <p style={{color: '#f00'}}>{this.state.message}</p>
    </div>;
  }
}
CSVFileInput.propTypes = {
  db: React.PropTypes.func.isRequired,
  dbChanged: React.PropTypes.func.isRequired
};


class DBClear extends React.Component {
  clear() {
    this.props.db().remove();
    this.props.dbChanged();
  }

  render() {
    return <button type='button' className='button-primary' onClick={this.clear.bind(this)}>Gebruik nieuwe gegevens</button>;
  }
}
DBClear.propTypes = {
  db: React.PropTypes.func.isRequired,
  dbChanged: React.PropTypes.func.isRequired
};


class Input extends React.Component {
  render() {
    var dbEmpty = this.props.db().get().length == 0;
    if (dbEmpty) {
      return <CSVFileInput db={this.props.db} dbChanged={this.props.onDbChanged} />;
    } else {
      return <DBClear db={this.props.db} dbChanged={this.props.onDbChanged} />;
    }
  }
}
Input.propTypes = {
  db: React.PropTypes.func.isRequired,
  onDbChanged: React.PropTypes.func.isRequired
};

export default Input;
