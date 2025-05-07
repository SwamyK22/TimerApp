import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { TimerContext } from '../context/TimerContext';

export default function HistoryScreen() {
  const { state } = useContext(TimerContext);

  const renderHistoryItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.timestamp}>
        Completed at: {new Date(item.completedAt).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Timer History</Text>
      <FlatList
        data={state.history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderHistoryItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10,
    borderColor: '#ccc',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    color: '#666',
  },
});
