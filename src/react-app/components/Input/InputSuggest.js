import React from 'react';
import classnames from 'classnames';

import { KEY_ARROW_DOWN, KEY_ARROW_UP, KEY_ENTER } from 'react-app/constants/keys';


class InputSuggest extends React.PureComponent {
  state = {
    selectedIndex: null
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.items !== nextProps.items) {
      this.onItemHover(null);
    }
  }

  componentDidMount() {
    this.enableDocumentListeners();
    this.mounted = true;
  }

  componentWillUnmount() {
    this.disableDocumentListeners();
  }

  enableDocumentListeners = () => {
    document.addEventListener('keydown', this.handleDocumentKeydown);
    document.addEventListener('click', this.handleDocumentClick);
  }

  disableDocumentListeners = () => {
    document.removeEventListener('keydown', this.handleDocumentKeydown);
    document.removeEventListener('click', this.handleDocumentClick);
  }

  onItemHover = (index, event) => {
    this.setState({ selectedIndex: index });

    if (typeof this.props.onItemHover === 'function') {
      this.props.onItemHover(index, event);
    }
  }

  onItemSelect = (value) => {
    if (typeof this.props.onItemSelect === 'function') {
      this.props.onItemSelect(value);
    }
  }

  handleDocumentKeydown = (event) => {
    var { items } = this.props;
    var { keyCode } = event;
    var maxIndex = items.length - 1;
    var newIndex;
    var selectedIndex = this.state.selectedIndex;

    switch (keyCode) {
      case KEY_ARROW_DOWN:
        event.preventDefault();
        if (selectedIndex === null) {
          newIndex = 0;
        } else {
          newIndex = selectedIndex >= maxIndex ? 0 : selectedIndex + 1;
        }
        this.onItemHover(newIndex, event);
        break;

      case KEY_ARROW_UP:
        event.preventDefault();
        if (selectedIndex === 0) {
          newIndex = null;
        } else {
          newIndex = selectedIndex && selectedIndex <= maxIndex ? selectedIndex - 1 : maxIndex;
        }
        this.onItemHover(newIndex, event);
        break;

      case KEY_ENTER:
        if (this.state.selectedIndex === null) {
          if (typeof this.props.onHide === 'function') {
            this.props.onHide();
          }
        } else {
          var item = this.props.items[this.state.selectedIndex];
          this.onItemSelect(item);
        }
        break;

      default:
        break;
    }
  }

  handleDocumentClick = (event) => {
    if (!this.mounted) {
      return;
    }

    var { target } = event;
    var { suggest } = this;
    var parent = target.parentElement;
    if (!suggest.contains(target) && parent.contains(target)) {
      return;
    }

    var { onHide } = this.props;
    if (typeof onHide === 'function') {
      onHide();
    }
  }

  render() {
    var { items } = this.props;
    var { selectedIndex } = this.state;

    return (
      <div ref={ref => this.suggest = ref} className="input-suggest">
        { items.map((item, i) => {
          var label = item;
          var classes = classnames({
            'input-suggest__item': true,
            'input-suggest__item--hovered': selectedIndex === i
          });

          return (
            <div className={classes} key={i} onMouseDown={this.onItemSelect.bind(this, label)} onMouseEnter={this.onItemHover.bind(this, i)}>
              <div className="input-suggest__item-label">{ label }</div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default InputSuggest;
