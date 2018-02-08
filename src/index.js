import React from 'react';
import ReactDOM from 'react-dom';
import palvelut from './palvelut';

const Sisalto = ({ henkilot, poistaHenkilo }) => {
  const tiedot = henkilot;
  console.log(tiedot)
  return (
    <div>
      <ul>
        {tiedot.map(henkilo => <Henkilo key={henkilo.id} henkilo={henkilo} poistaHenkilo={poistaHenkilo} />)}
      </ul>
    </div>
  );
};

const Henkilo = ({ henkilo, poistaHenkilo }) => (
  <li>{henkilo.name}: {henkilo.number} <button onClick={poistaHenkilo(henkilo.id)}>poista</button></li>
);

const Lomake = ({ state, lisaaHenkilo, kasitteleNimi, kasitteleNumero }) => (
  <form onSubmit={lisaaHenkilo}>
    <div>
      name: <input
        onChange={kasitteleNimi}
        value={state.kasitteleNimi} />
    </div>
    <div>
      number: <input
        onChange={kasitteleNumero}
        value={state.kasitteleNumero} />
    </div>
    <button type="submit">lisää numero</button>
  </form>
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      henkilot: [],
      kasitteleNimi: '',
      kasitteleNumero: '',
    };
    palvelut.getAll().then((response) => {
      console.log('response data:',response)
      this.setState({ henkilot: response});
    });
  }

  palautaId = name => this.state.henkilot.find(henkilo => henkilo.name === name)

  lisaaHenkilo = (event) => {
    event.preventDefault();
    const uusiHenkilo = {
      name: this.state.kasitteleNimi,
      number: this.state.kasitteleNumero,
    };

    const h = this.onkoHenkiloLuettelossa(this.state.kasitteleNimi);

    if (!this.onkoHenkiloLuettelossa(this.state.kasitteleNimi)) {
      palvelut.create(uusiHenkilo).then((response) => {
        this.setState({
          henkilot: this.state.henkilot.concat(response.data),
          kasitteleNimi: '',
          kasitteleNumero: '',
        });
      });
    } else {
      this.paivitaHenkilo(h, this.state.kasitteleNumero);
    }
  }

  paivitaHenkilo = (henkilo, uusinumero) => {
    palvelut.update({ ...henkilo, number: uusinumero }, uusinumero)
      .then((response) => {
        const henkilot = this.state.henkilot.filter(n => n.id !== henkilo.id);
        this.setState({
          henkilot: henkilot.concat(response.data),
        });
      });
  }

  poistaHenkilo = id => () => {
    if (window.confirm('Haluatko varmasti poistaa tämän henkilön?')) {
      palvelut.remove(id)
        .then(() => {
          const henkilot = this.state.henkilot.filter(n => n.id !== id);
          this.setState({
            henkilot,
          });
        });
    }
  }

  onkoHenkiloLuettelossa = name => this.state.henkilot.find(henkilo => henkilo.name === name)

  kasitteleNimi = (event) => {
    this.setState({ kasitteleNimi: event.target.value });
  }

  kasitteleNumero = (event) => {
    this.setState({ kasitteleNumero: event.target.value });
  }

  render() {
    return (
      <div>
        <h2>Puhelinluettelo</h2>
        <Lomake
          state={this.state}
          lisaaHenkilo={this.lisaaHenkilo}
          kasitteleNimi={this.kasitteleNimi}
          kasitteleNumero={this.kasitteleNumero} />
        <h2>Numerot</h2>
        <Sisalto henkilot={this.state.henkilot} poistaHenkilo={this.poistaHenkilo} />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);