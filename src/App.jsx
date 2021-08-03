import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import P5Wrapper from 'react-p5-wrapper';
import { InlineAlert } from 'evergreen-ui';
import waves from './sketchs/waves';
import blobs from './sketchs/blobs';
import Verses from './components/Verses';
import ConfigMenu from './components/ConfigMenu';
import SearchInput from './components/SearchInput';
import ColorName from './components/ColorName';
import { saveBackground, insertFont, fetchAndSetFont, pickColor } from './utils';
import Storager from './utils/storager';
import { load } from './utils/jinrishici';
import {
  HORIZONTAL,
  VERTICAL,
  WAVES,
  GOOGLE_SEARCH,
  DEFAULT_SHICI,
  DEFAULT_FONT,
} from './constants/appConstants';
import GlobalStyle from './components/GlobalStyle';

const DEFAULT_SHICI_LIST = require('./constants/shici.json');

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPlaying: true,
      showSearchBarChecked: false,
      darkModeChecked: false,
      defaultPlayChecked: true,
      colorStayChecked: false,
      verses: DEFAULT_SHICI,
      versesLayout: HORIZONTAL,
      errMessage: '',
      engineOption: GOOGLE_SEARCH,
      value: '',
      focused: false,
      fontName: DEFAULT_FONT,
      waveColor: pickColor(false),
      showFullContentChecked: false,
    };
  }

  componentDidMount() {
    const hasZh = navigator.languages.includes('zh');
    document.title = hasZh ? '新标签页' : 'New Tab';

    load(
      (result) => {
        Storager.set({ verses: result.data });
      },
      (err) => {
        this.setState({ errMessage: err.errMessage });
        const localShici =
          DEFAULT_SHICI_LIST[Math.floor(Math.random() * DEFAULT_SHICI_LIST.length)];
        Storager.set({ verses: localShici });
      }
    );

    Storager.get(
      [
        'verses',
        'versesLayout',
        'selected',
        'colorStayChecked',
        'defaultPlayChecked',
        'engineOption',
        'showSearchBarChecked',
        'fontName',
        'fonts',
        'darkModeChecked',
        'showFullContentChecked',
      ],
      (res) => {
        if (res.fonts && res.fontName === res.fonts.fontName) {
          insertFont(res.fonts.value);
        }
        this.setState({
          showSearchBarChecked: !!res.showSearchBarChecked,
          darkModeChecked: !!res.darkModeChecked,
          colorStayChecked: !!res.colorStayChecked,
          defaultPlayChecked: res.defaultPlayChecked !== false,
          isVerticalVerses: res.versesLayout === VERTICAL,
          isPlaying: res.defaultPlayChecked !== false,
          verses: res.verses || DEFAULT_SHICI,
          selected: res.selected || WAVES,
          engineOption: res.engineOption || GOOGLE_SEARCH,
          fontName: res.fontName || DEFAULT_FONT,
          waveColor: pickColor(!!res.darkModeChecked),
          showFullContentChecked: !!res.showFullContentChecked,
        });
      }
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.darkModeChecked !== this.state.darkModeChecked) {
      this.setState(() => ({ waveColor: pickColor(this.state.darkModeChecked) }));
    }
  }

  handlePlayPauseSelect = () => this.setState((state) => ({ isPlaying: !state.isPlaying }));

  handleShowSearchBarChange = () => {
    this.setState(
      (state) => ({
        showSearchBarChecked: !state.showSearchBarChecked,
      }),
      () => {
        Storager.set({ showSearchBarChecked: this.state.showSearchBarChecked });
      }
    );
  };

  handleDarkModeChange = () => {
    this.setState(
      (state) => ({
        darkModeChecked: !state.darkModeChecked,
      }),
      () => {
        Storager.set({ darkModeChecked: this.state.darkModeChecked });
      }
    );
  };

  handleVersesLayoutChange = () => {
    this.setState(
      (state) => ({
        isVerticalVerses: !state.isVerticalVerses,
      }),
      () => {
        Storager.set({
          versesLayout: this.state.isVerticalVerses ? VERTICAL : HORIZONTAL,
        });
      }
    );
  };

  handleDefaultPlayChange = () => {
    this.setState(
      (state) => ({
        defaultPlayChecked: !state.defaultPlayChecked,
      }),
      () => {
        Storager.set({ defaultPlayChecked: this.state.defaultPlayChecked });
      }
    );
  };

  handleColorStayChange = () => {
    this.setState(
      (state) => ({
        colorStayChecked: !state.colorStayChecked,
      }),
      () => {
        Storager.set({ colorStayChecked: this.state.colorStayChecked });
      }
    );
  };

  handleBgOptionChange = (selected) => {
    this.setState({ selected }, () => {
      Storager.set({ selected });
    });
  };

  handleShowFullContentChange = () => {
    this.setState(
      (state) => ({
        showFullContentChecked: !state.showFullContentChecked,
      }),
      () => {
        Storager.set({ showFullContentChecked: this.state.showFullContentChecked });
      }
    );
  };

  handleKeyDown = ({ keyCode, altKey }) => {
    // space
    if (keyCode === 32) this.setState((state) => ({ isPlaying: !state.isPlaying }));
    // S + alt
    if (keyCode === 83 && altKey) saveBackground();

    // left or right arrow keys
    if (keyCode === 37 || keyCode === 39) {
      this.setState(() => ({ waveColor: pickColor(this.state.darkModeChecked) }));
    }
  };

  handleFontTypeChange = (fontName) => {
    if (fontName !== DEFAULT_FONT) {
      this.setState(() => ({ isFontLoading: true }));

      Storager.get(['fonts'], (res) => {
        if (res.fonts && res.fonts.fontName === fontName) {
          insertFont(res.fonts.value);
          this.setState(() => ({ isFontLoading: false }));
        } else {
          fetchAndSetFont(fontName)
            .then(() => {
              this.setState(() => ({ isFontLoading: false }));
            })
            .catch((err) => console.log(err));
        }
      });
    }

    this.setState({ fontName }, () => Storager.set({ fontName }));
  };

  handleEngineOptionChange = (engineOption) =>
    this.setState({ engineOption }, () => Storager.set({ engineOption }));

  handleChange = ({ target: { value } }) => this.setState({ value });

  handleFocus = () => this.setState({ focused: true });

  handleBlur = () => this.setState({ focused: false });

  render() {
    const {
      verses,
      isVerticalVerses,
      isPlaying,
      showSearchBarChecked,
      defaultPlayChecked,
      colorStayChecked,
      selected,
      errMessage,
      engineOption,
      value,
      focused,
      fontName,
      darkModeChecked,
      waveColor,
      isFontLoading,
      showFullContentChecked,
    } = this.state;
    const sketches = { blobs, waves };

    return selected ? (
      <div className="App" tabIndex="-1" onKeyDown={this.handleKeyDown}>
        <GlobalStyle />
        {selected === WAVES && (
          <ColorName
            key={waveColor.name}
            fontName={fontName}
            colorName={waveColor.name}
            colorStayChecked={colorStayChecked}
            isDarkMode={darkModeChecked}
          />
        )}
        <Verses
          key={isVerticalVerses}
          bgOption={selected}
          verses={verses}
          isVerticalVerses={isVerticalVerses}
          engineOption={engineOption}
          isDarkMode={darkModeChecked}
          fontName={fontName}
          showFullContentChecked={showFullContentChecked}
        />
        <P5Wrapper
          sketch={sketches[selected]}
          isPlaying={isPlaying}
          isDarkMode={darkModeChecked}
          waveColor={waveColor.hex}
        />
        <ConfigMenu
          onPlayPauseSelect={this.handlePlayPauseSelect}
          isPlaying={isPlaying}
          verticalVersesChecked={isVerticalVerses}
          showSearchBarChecked={showSearchBarChecked}
          darkModeChecked={darkModeChecked}
          onDarkModeChange={this.handleDarkModeChange}
          onShowSearchBarChange={this.handleShowSearchBarChange}
          defaultPlayChecked={defaultPlayChecked}
          onDefaultPlayChange={this.handleDefaultPlayChange}
          onVerticalVersesChange={this.handleVersesLayoutChange}
          colorStayChecked={colorStayChecked}
          onColorStayChange={this.handleColorStayChange}
          selected={selected}
          onBgOptionChange={this.handleBgOptionChange}
          engineOption={engineOption}
          onEngineOptionChange={this.handleEngineOptionChange}
          fontName={fontName}
          onFontTypeChange={this.handleFontTypeChange}
          isFontLoading={isFontLoading}
          waveColor={waveColor}
          showFullContentChecked={showFullContentChecked}
          onShowFullContentChange={this.handleShowFullContentChange}
        >
          {errMessage && (
            <div style={{ height: 30 }}>
              <InlineAlert intent="warning" marginLeft={20} marginRight={20}>
                {errMessage}
              </InlineAlert>
            </div>
          )}
        </ConfigMenu>
        {showSearchBarChecked && (
          <SearchInput
            value={value}
            focused={focused}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            engineOption={engineOption}
            isDarkMode={darkModeChecked}
          />
        )}
      </div>
    ) : null;
  }
}

export default hot(module)(App);
