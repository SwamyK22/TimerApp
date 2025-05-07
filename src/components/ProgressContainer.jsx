import {View, StyleSheet} from 'react-native';
import React from 'react';

const ProgressContainer = ({timer}) => {
  return (
    <View style={styles.progressContainer}>
      <View
        style={[
          styles.progressBar,
          {width: `${(timer.remaining / timer.duration) * 100}%`},
        ]}
      />
    </View>
  );
};

export default ProgressContainer;

const styles = StyleSheet.create({
  progressContainer: {
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
});
