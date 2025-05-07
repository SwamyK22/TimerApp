import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {TimerContext} from '../context/TimerContext';
import {storeData, getData, clearAll} from '../../utils/storage';
import ProgressContainer from '../components/ProgressContainer';

export default function HomeScreen({navigation}) {
  const {state, dispatch} = useContext(TimerContext);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');
  const intervalRefs = useRef({});
  const stateRef = useRef(state);

  const handleAddTimer = () => {
    if (!name || !duration || !category) {
      return;
    }

    const newTimer = {
      id: stateRef.current?.timers.length + 1,
      name,
      duration: parseInt(duration),
      remaining: parseInt(duration),
      category,
      status: 'Paused',
    };

    dispatch({type: 'ADD_TIMER', payload: newTimer});

    setName('');
    setDuration('');
    setCategory('');
  };

  const handleStart = timer => {
    if (timer.status === 'Running' || timer.status === 'Completed') return;
    const intervalId = setInterval(() => {
      const currentTimer = stateRef.current.timers.find(t => t.id === timer.id);
      if (!currentTimer || currentTimer.status === 'Completed') {
        clearInterval(intervalRefs.current[timer.id]);
        return;
      }
      const newRemaining = currentTimer.remaining - 1;
      dispatch({
        type: 'UPDATE_TIMER',
        payload: {
          ...currentTimer,
          remaining: newRemaining,
          status: newRemaining <= 0 ? 'Completed' : 'Running',
        },
      });

      if (newRemaining <= 0) {
        clearInterval(intervalRefs.current[timer.id]);
        dispatch({
          type: 'ADD_HISTORY',
          payload: {
            name: currentTimer.name,
            completedAt: new Date().toISOString(),
          },
        });
      }
    }, 1000);

    intervalRefs.current[timer.id] = intervalId;
  };

  const handlePause = timer => {
    clearInterval(intervalRefs.current[timer.id]);
    dispatch({
      type: 'UPDATE_TIMER',
      payload: {...timer, status: 'Paused'},
    });
  };

  const handleReset = timer => {
    clearInterval(intervalRefs.current[timer.id]);
    dispatch({
      type: 'UPDATE_TIMER',
      payload: {...timer, remaining: timer.duration, status: 'Paused'},
    });
  };
  const clearAllTimers = () => {
    clearAll();
    dispatch({type: 'CLEAR_ALL_TIMERS'});
  };

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    (async () => {
      const savedTimers = await getData('timers');
      if (savedTimers) {
        dispatch({type: 'ADD_TIMERS', payload: savedTimers});
      }
    })();
  }, []);

  useEffect(() => {
    storeData('timers', state.timers);
  }, [state.timers]);

  const renderTimer = ({item}) => (
    <View style={styles.timerCard}>
      {item.remaining <= Math.floor(item.duration / 2) &&
        item.status === 'Running' && (
          <Text style={styles.alert}>{`${item.name} is halfway done!`}</Text>
        )}
      {item.status === 'Running' && <ProgressContainer timer={item} />}
      {item.status === 'Completed' && (
        <Text
          style={
            styles.cngMessage
          }>{`Congratulations! ${item.name} is completed!`}</Text>
      )}
      <Text style={styles.timerTitle}>{item.name}</Text>
      <Text>Remaining: {item.remaining}s</Text>
      <Text>Status: {item.status}</Text>
      <View style={styles.timerButtons}>
        <Button title="Start" onPress={() => handleStart(item)} />
        <Button title="Pause" onPress={() => handlePause(item)} />
        <Button title="Reset" onPress={() => handleReset(item)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create Timer</Text>
      <TextInput
        style={styles.input}
        placeholder="Timer Name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor="#999"
        placeholder="Duration (seconds)"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        placeholderTextColor="#999"
        value={category}
        onChangeText={setCategory}
      />
      <Button title="Add Timer" onPress={handleAddTimer} />
      <View style={styles.timerHeading}>
        <Text style={styles.heading}>Timers</Text>
        <TouchableOpacity onPress={clearAllTimers}>
          <Text style={styles.clear}>Clear All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={state.timers}
        keyExtractor={item => item.id}
        renderItem={renderTimer}
      />

      <TouchableOpacity onPress={() => navigation.navigate('History')}>
        <Text style={styles.link}>Go to History</Text>
      </TouchableOpacity>
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
    fontSize: 20,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  timerHeading: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  timerCard: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 5,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  timerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  link: {
    marginTop: 20,
    color: 'blue',
    textAlign: 'center',
  },
  clear: {
    fontWeight: 'bold',
    color: 'blue',
  },
  alert: {
    color: 'red',
    textAlign: 'center',
  },
  cngMessage: {color: '#28a745', fontWeight: 'bold'},
});
