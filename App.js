import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

const App = () => {
  const intialState = {
    id: 0,
    title: '',
    description: '',
    completed: false,
  };

  const [todo, setTodo] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTodo, setNewTodo] = useState(intialState);

  const getTodos = async () => {
    const todos = await AsyncStorage.getItem('todo');
    setTodo(JSON.parse(todos) ? JSON.parse(todos) : []);
  };

  useEffect(() => {
    getTodos();
  }, []);

  const handleChange = (title, value) =>
    setNewTodo({...newTodo, [title]: value});

  const clear = () => setNewTodo(intialState);

  const addTodo = () => {
    if (!newTodo.title || !newTodo.description) {
      alert('Please enter all the values.');
      return;
    }

    newTodo.id = todo.length + 1;
    const updatedTodo = [newTodo, ...todo];
    setTodo(updatedTodo);
    AsyncStorage.setItem('todo', JSON.stringify(updatedTodo));
    clear();
    setShowModal(false);
  };

  const updateTodo = item => {
    const itemToBeUpdated = todo.filter(todoItem => todoItem.id == item.id);
    itemToBeUpdated[0].completed = !itemToBeUpdated[0].completed;

    const remainingTodos = todo.filter(todoItem => todoItem.id != item.id);
    const updatedTodo = [...itemToBeUpdated, ...remainingTodos];

    setTodo(updatedTodo);
    AsyncStorage.setItem('todo', JSON.stringify(updatedTodo));
  };

  const displayTodo = item => (
    <TouchableOpacity
      style={styles.todoList}
      onPress={() =>
        Alert.alert(`${item.title}`, `${item.description}`, [
          {
            text: item.completed ? 'Mark InProgress' : 'Mark Completed',
            onPress: () => updateTodo(item),
          },
          {
            text: 'Ok',
            style: 'cancel',
          },
        ])
      }>
      <BouncyCheckbox
        isChecked={item.completed ? true : false}
        fillColor="blue"
        onPress={() => updateTodo(item)}
      />
      <Text
        style={{
          color: 'black',
          width: '90%',
          fontSize: 16,
          textDecorationLine: item.completed ? 'line-through' : 'none',
        }}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{paddingHorizontal: 20}}>
      <View style={styles.display}>
        <View>
          <Text style={styles.name}>Hai, David. 👋</Text>
          <Text style={styles.activity}>
            {todo.length} {todo.length == 1 ? 'task' : 'tasks'} for you
          </Text>
        </View>
      </View>

      <Text style={styles.header}>Todo</Text>
      <ScrollView>
        <View style={styles.scrollView}>
          {todo.map(item => (!item.completed ? displayTodo(item) : null))}
        </View>
      </ScrollView>

      <Text style={styles.header}>Completed</Text>
      <ScrollView>
        <View style={styles.scrollView}>
          {todo.map(item => (item.completed ? displayTodo(item) : null))}
        </View>
      </ScrollView>

      <View style={{width: '100%', alignItems: 'flex-end'}}>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={styles.addTodo}>
          <Text style={styles.textAddTodo}>+</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        visible={showModal}
        onRequestClose={() => setShowModal(false)}>
        <View style={styles.modal}>
          <View style={styles.modalView}>
            <View>
              <Text style={styles.name}>Hai, David. 👋</Text>
              <Text style={styles.activity}>
                {todo.length} {todo.length == 1 ? 'task' : 'tasks'} for you
              </Text>
            </View>
          </View>

          <Text style={styles.header}>Add a Todo</Text>
          <TextInput
            placeholder="Title"
            value={newTodo.title}
            onChangeText={title => handleChange('title', title)}
            style={styles.inputTodo}
          />
          <TextInput
            placeholder="Description"
            value={newTodo.description}
            onChangeText={desc => handleChange('description', desc)}
            style={styles.inputDescription}
            multiline={true}
            numberOfLines={4}
          />

          <View style={styles.viewButtonAddTodo}>
            <TouchableOpacity onPress={addTodo} style={styles.buttonAddTodo}>
              <Text style={styles.textButtonAddTodo}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  todoList: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    paddingVertical: 16,
  },
  display: {
    paddingVertical: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {color: 'black', fontWeight: 'bold', fontSize: 28},
  activity: {fontSize: 16},
  header: {color: 'black', fontSize: 28, fontWeight: 'bold'},
  scrollView: {height: 250},
  addTodo: {
    backgroundColor: 'blue',
    borderRadius: 100,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
  },
  textAddTodo: {fontSize: 46, color: 'white'},
  modal: {paddingHorizontal: 20},
  modalView: {
    paddingVertical: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputTodo: {
    backgroundColor: 'rgb(240, 240, 240)',
    paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  inputDescription: {
    backgroundColor: 'rgb(240, 240, 240)',
  },
  viewButtonAddTodo: {width: '100%', alignItems: 'center', marginTop: 10},
  buttonAddTodo: {
    backgroundColor: 'blue',
    width: 100,
    borderRadius: 10,
    alignItems: 'center',
    padding: 10,
  },
  textButtonAddTodo: {fontSize: 22, color: 'white'},
});

export default App;
