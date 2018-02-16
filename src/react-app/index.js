import '@babel/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import { getSuggestItems, getSearchItems, fakeSuggestItems } from 'shared/processQuery';

import Input from './components/Input';

import './App.scss';


class App extends React.Component {
  state = {
    searchQuery: '',
    lastEnteredQuery: '',
    suggestItems: null,
    waitingForSuggest: false,
    searchItems: null,
    searching: false
  }

  suggestCache = {}

  onBlur = () => {
    this.setState({
      waitingForSuggest: false,
      suggestItems: null
    });
  }

  onChange = (value) => {
    this.setState({
      searchQuery: value,
      lastEnteredQuery: value,
      waitingForSuggest: !!value,
      searching: false,
      searchItems: null
    }, () => {
      this.loadSuggest(value);
    });
  }

  loadSuggest = (query) => {
    if (!query) {
      this.onSuggestLoaded(null);
      return;
    }

    if (this.suggestCache[query]) {
      this.onSuggestLoaded(this.suggestCache[query]);
      return;
    }

    getSuggestItems(query)
      .then((res) => {
        this.suggestCache[query] = res;

        // do nothing if input value has changed
        if (query !== this.state.searchQuery) {
          return;
        }

        this.onSuggestLoaded(res);
      });
  }

  onSuggestLoaded = (res) => {
    if (res && !this.state.waitingForSuggest) {
      return;
    }

    this.setState({
      suggestItems: res && res.length ? res : null,
      waitingForSuggest: false
    });
  }

  onSuggestItemSelect = (query) => {
    this.setState({
      searchQuery: query,
      suggestItems: null
    });

    this.loadSearchItems(query);
  }

  onSuggestItemHover = (itemIndex, event) => {
    if (!event || event.type !== 'keydown') {
      return;
    }

    var query = this.state.lastEnteredQuery;
    if (itemIndex !== null) {
      query = this.state.suggestItems[itemIndex];
    }

    this.setState({
      searchQuery: query
    });
  }

  loadSearchItems = (query = this.state.searchQuery) => {
    if (!query) {
      this.onSearchItemsLoaded(null);
      return;
    }

    this.setState({
      searching: true,
      suggestItems: null,
      waitingForSuggest: null
    });

    getSearchItems(query)
      .then((res) => {
        // do nothing if input value has changed
        if (query !== this.state.searchQuery) {
          return;
        }

        this.onSearchItemsLoaded(res);
      });
  }

  onSearchItemsLoaded = (res) => {
    this.setState({
      searchItems: res,
      searching: false
    });
  }

  render() {
    var { searchQuery, suggestItems, searching, searchItems } = this.state;

    return (
      <div className="demo-app">
        <Input autoFocus placeholder="Lets look at this demo" loading={searching} value={searchQuery} onChange={this.onChange} onBlur={this.onBlur} className="app-input" suggestItems={suggestItems} onSuggestItemSelect={this.onSuggestItemSelect} onSuggestItemHover={this.onSuggestItemHover} onEnterPress={this.loadSearchItems} />
        { searchItems ?
          <div className="search-results">
            <div className="search-results__label">
              { searchItems.length ?
                <span>Results for <strong>{ searchQuery }</strong>:</span>
              :
                <span>Nothing found for <strong>{ searchQuery }</strong></span>
              }
            </div>
            { searchItems.map((item, i) =>
              <div className="search-item" key={i}>{ item }</div>
            )}
          </div>
        :
          <div className="suggest-hint"><span className="suggest-hint__intro">Suggest words:</span> { fakeSuggestItems.join(', ') }</div>
        }
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#root'));
