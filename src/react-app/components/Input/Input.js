import React from 'react';
import classnames from 'classnames';

import Spinner from 'react-app/components/Spinner';

import InputSuggest from './InputSuggest';

import './Input.scss';


class Input extends React.PureComponent {
  state = {
    focused: false
  }

  onFocus = (event) => {
    this.setState({ focused: true });

    if (typeof this.props.onFocus === 'function') {
      this.props.onFocus(event);
    }
  }

  onBlur = (event) => {
    this.setState({ focused: false });

    if (typeof this.props.onBlur === 'function') {
      this.props.onBlur(event);
    }
  }

  onKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (typeof this.props.onEnterPress === 'function') {
        this.props.onEnterPress();
      }
    }

    if (event.key === 'Escape') {
      if (typeof this.props.onEscPress === 'function') {
        this.props.onEscPress();
      }
    }

    if (typeof this.props.onKeyDown === 'function') {
      this.props.onKeyDown(event);
    }
  }

  onChange = (event) => {
    var value = event.target.value;

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(value, event);
    }
  }

  render() {
    var { label, disabled, className, onEnterPress, onEscPress, loading, suggestItems, onSuggestItemSelect, onSuggestItemHover, placeholder, onSearch, search, ...restProps } = this.props;
    var { focused } = this.state;
    var classes = classnames({
      'input': true,
      'input--focus': focused && !disabled,
      'input--loading': loading,
      'input--search': !loading && search
    }, className);

    var showPlaceholder = !!placeholder && !this.props.value;

    return (
      <div className={classes}>
        { showPlaceholder && <div className="input__placeholder">{ placeholder }</div> }
        { search && <div className="input__btn-search" onClick={loading ? null : onSearch} /> }
        { loading && <div className="input__ico-loading"><Spinner /></div> }
        <input {...restProps} onFocus={this.onFocus} onBlur={this.onBlur} onChange={this.onChange} onKeyDown={this.onKeyDown} />
        { suggestItems && <InputSuggest items={suggestItems} onItemSelect={onSuggestItemSelect} onItemHover={onSuggestItemHover} /> }
      </div>
    );
  }
}

export default Input;
