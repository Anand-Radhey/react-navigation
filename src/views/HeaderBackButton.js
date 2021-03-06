/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import {
  I18nManager,
  Image,
  Text,
  View,
  Platform,
  StyleSheet,
} from 'react-native';

import type { LayoutEvent } from '../TypeDefinition';

import TouchableItem from './TouchableItem';

type Props = {
  onPress?: () => void,
  pressColorAndroid?: ?string,
  title?: ?string,
  tintColor?: ?string,
  truncatedTitle?: ?string,
  width?: ?number,
};

type DefaultProps = {
  pressColorAndroid: ?string,
  tintColor: ?string,
  truncatedTitle: ?string,
};

type State = {
  initialTextWidth?: number,
};

class HeaderBackButton extends React.PureComponent<DefaultProps, Props, State> {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    pressColorAndroid: PropTypes.string,
    title: PropTypes.string,
    tintColor: PropTypes.string,
    truncatedTitle: PropTypes.string,
    width: PropTypes.number,
  };

  static defaultProps = {
    pressColorAndroid: 'rgba(0, 0, 0, .32)',
    tintColor: Platform.select({
      ios: '#037aff',
    }),
    truncatedTitle: 'Back',
  };

  state = {};

  _onTextLayout = (e: LayoutEvent) => {
    if (this.state.initialTextWidth) {
      return;
    }
    this.setState({
      initialTextWidth: e.nativeEvent.layout.x + e.nativeEvent.layout.width,
    });
  };

  render() {
    const { onPress, pressColorAndroid, width, title, tintColor, truncatedTitle } = this.props;

    const renderTruncated = this.state.initialTextWidth && width
      ? this.state.initialTextWidth > width
      : false;

    return (
      <TouchableItem
        delayPressIn={0}
        onPress={onPress}
        pressColor={pressColorAndroid}
        style={styles.container}
        borderless
      >
        <View style={styles.container}>
          <Image
            style={[
              styles.icon,
              title && styles.iconWithTitle,
              { tintColor },
            ]}
            source={require('./assets/back-icon.png')}
          />
          {Platform.OS === 'ios' && title && (
            <Text
              onLayout={this._onTextLayout}
              style={[styles.title, { color: tintColor }]}
              numberOfLines={1}
            >
              {renderTruncated ? truncatedTitle : title}
            </Text>
          )}
        </View>
      </TouchableItem>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 17,
    paddingRight: 10,
  },
  icon: Platform.OS === 'ios'
    ? {
      height: 20,
      width: 12,
      marginLeft: 10,
      marginRight: 22,
      marginVertical: 12,
      resizeMode: 'contain',
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    }
    : {
      height: 24,
      width: 24,
      margin: 16,
      resizeMode: 'contain',
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    },
  iconWithTitle: Platform.OS === 'ios'
    ? {
      marginRight: 5,
    }
    : {},
});

export default HeaderBackButton;
