//set REACT_NATIVE_PACKAGER_HOSTNAME=10.132.230.240
import { StatusBar } from 'expo-status-bar';
import { useState,useEffect  } from 'react';
import { 
  KeyboardAvoidingView, 
  StyleSheet, 
  Text, 
  View, 
  TextInput,  
  TouchableOpacity, 
  Keyboard,  
  ScrollView,
  Animated,
  TouchableHighlight,
  
} from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import { SwipeListView } from 'react-native-swipe-list-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function App() {
  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState(
    [
       {
        "color": "#fff",
        "completed": false,
        "key": 0,
        "text": "Hola",
        "subTasks": [
          {
            "color": "#fff",
            "completed": false,
            "key": 3,
            "text": "subtask"
          },
        ]
      },
       {
        "color": "#fff",
        "completed": false,
        "key": 1,
        "text": "Mundo ",
        "subTasks": []
        
      },
       {
        "color": "#fff",
        "completed": false,
        "key": 2,
        "text": "Hola hola ",
        "subTasks": []
      },
    ]
  );


  const [isColorActive, setIsColorActive] = useState(false);
  const [color, setColor] = useState('#fff');

  useEffect(() => {
    //console.log(taskItems);
  }, [taskItems]);

  const handleColorChoose = (color) => {
    setIsColorActive(false);
    setColor(color);
  };

  const handleAddColor = (color) => {
    setIsColorActive(current => !current);
  };
  

  const revertCompletedTask  = (index) => {
    let itemsCopy = [...taskItems];

    index = itemsCopy.findIndex(item => item.key == index);
    let taskItemAux = itemsCopy[index];
    taskItemAux.completed = false;

    itemsCopy.splice(index, 1);

    let indexCompleted = itemsCopy.findIndex(item => item.completed == true);
    if(indexCompleted == -1){
      indexCompleted = itemsCopy.length;
    }
    itemsCopy.splice(indexCompleted, 0, taskItemAux);

    setTaskItems([...itemsCopy]);
  }

  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    index = itemsCopy.findIndex(item => item.key == index);

    let taskItemAux = itemsCopy[index];
    taskItemAux.completed = true;

    itemsCopy.splice(index, 1);
    setTaskItems([...itemsCopy, taskItemAux]);

  }


  const handleAddTask = () => {
    if(task == null || task == ''){
      console.log(taskItems)
      return
    }
    const task_aux = {
      text: task,
      color: color,
      key: taskItems.length,
      completed: false,
      subTasks: []
    }
    let itemsCopy = [...taskItems];

    let indexCompleted = itemsCopy.findIndex(item => item.completed == true);
    if(indexCompleted == -1){
      indexCompleted = itemsCopy.length;
    }
    itemsCopy.splice(indexCompleted, 0, task_aux);

    Keyboard.dismiss();

    setTaskItems([...itemsCopy]);
    setTask(null);
  }; 
  
  const Task = props => {
    const {
        data,
        rowHeightAnimatedValue,
        removeRow,
        rightActionState,
      } = props;
  
      if (rightActionState) {
        Animated.timing(rowHeightAnimatedValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          removeRow();
        });
      }

    return (
      <View>
        <Animated.View >
            <TouchableHighlight 
                onPress={() => console.log(`Element touched ${data.item.key}`)}
                underlayColor={'#aaa'}
                style={taskStyles.item}
            >
                <View style={taskStyles.itemInside}>
                    <View style={taskStyles.itemLeft}>
                    <TouchableOpacity style={{
                            zIndex: 15,
                            elevation: (Platform.OS === 'android') ? 50 : 0
                        }} onPress={ data.item.completed ? () => revertCompletedTask(data.item.key) : () => completeTask(data.item.key) }>
                        <View style={data.item.completed ? taskStyles.squareDeleted : taskStyles.square}></View>
                    </TouchableOpacity>
                        <Text style={data.item.completed ? taskStyles.itemTextDeleted : taskStyles.itemText}>{data.item.text}</Text>
                    </View>
                    <View style={taskStyles.circular(data.item.color)}></View>
                </View>
            </TouchableHighlight>
        </Animated.View>
        {
          data.item.subTasks.map((subTask, index) => {
            return (
              <View style={taskStyles.subTaskContainer}>
                 <Animated.View >
                    <TouchableHighlight 
                        onPress={() => console.log(`Element touched ${subTask.key}`)}
                        underlayColor={'#aaa'}
                        style={taskStyles.item}
                    >
                        <View style={taskStyles.itemInside}>
                            <View style={taskStyles.itemLeft}>
                            <TouchableOpacity style={{
                                    zIndex: 15,
                                    elevation: (Platform.OS === 'android') ? 50 : 0
                                }} onPress={ subTask.completed ? () => revertCompletedTask(subTask.key) : () => completeTask(subTask.key) }>
                                <View style={subTask.completed ? taskStyles.squareDeleted : taskStyles.square}></View>
                            </TouchableOpacity>
                                <Text style={subTask.completed ? taskStyles.itemTextDeleted : taskStyles.itemText}>{subTask.text}</Text>
                            </View>
                            <View style={taskStyles.circular(subTask.color)}></View>
                        </View>
                    </TouchableHighlight>
                </Animated.View>
              </View>
            )
        })
      }
      </View>
    )
  }


  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    const newData = [...taskItems];
    const prevIndex = taskItems.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setTaskItems(newData);
  };

  const renderItem = (data, rowMap) => {
    const rowHeightAnimatedValue = new Animated.Value(60);

    return (
      <Task
        data={data}
        rowHeightAnimatedValue={rowHeightAnimatedValue}
        removeRow={() => deleteRow(rowMap, data.item.key)}
      />
    );
  };

  const HiddenItemWithActions = props => {
    const {
      swipeAnimatedValue,
      leftActionActivated,
      rightActionActivated,
      rowActionAnimatedValue,
      rowHeightAnimatedValue,
      onClose,
      onDelete,
    } = props;

    if (rightActionActivated) {
      Animated.spring(rowActionAnimatedValue, {
        toValue: 500,
        useNativeDriver: false
      }).start();
    } else {
      Animated.spring(rowActionAnimatedValue, {
        toValue: 75,
        useNativeDriver: false
      }).start();
    }

    return (
      <Animated.View style={[styles.rowBack, {height: rowHeightAnimatedValue}]}>
        <Text>Left</Text>
        {!leftActionActivated && (
          <TouchableOpacity
            style={[styles.backRightBtn, styles.backRightBtnLeft]}
            onPress={onClose}>
            <MaterialCommunityIcons
              name="close-circle-outline"
              size={25}
              style={styles.trash}
              color="#fff"
            />
          </TouchableOpacity>
        )}
        {!leftActionActivated && (
          <Animated.View
            style={[
              styles.backRightBtn,
              styles.backRightBtnRight,
              {
                flex: 1,
                width: rowActionAnimatedValue,
              },
            ]}>
            <TouchableOpacity
              style={[styles.backRightBtn, styles.backRightBtnRight]}
              onPress={onDelete}>
              <Animated.View
                style={[
                  styles.trash,
                  {
                    transform: [
                      {
                        scale: swipeAnimatedValue.interpolate({
                          inputRange: [-90, -45],
                          outputRange: [1, 0],
                          extrapolate: 'clamp',
                        }),
                      },
                    ],
                  },
                ]}>
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={25}
                  color="#fff"
                />
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  const renderHiddenItem = (data, rowMap) => {
    const rowActionAnimatedValue = new Animated.Value(75);
    const rowHeightAnimatedValue = new Animated.Value(60);

    return (
      <HiddenItemWithActions
        data={data}
        rowMap={rowMap}
        rowActionAnimatedValue={rowActionAnimatedValue}
        rowHeightAnimatedValue={rowHeightAnimatedValue}
        onClose={() => closeRow(rowMap, data.item.key)}
        onDelete={() => deleteRow(rowMap, data.item.key)}
      />
    );
  };

  ///
  
  return (
    
    <View style={styles.container}>
      {/* Tasks del día */}

      <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTittle}>Hoy</Text>


        <View style={{flexDirection: "row",}}>
          <View style={{paddingRight: 10}}>
            <TouchableOpacity onPress={() => console.log('Marked all done')}>
              <Text>
                <MaterialCommunityIcons name="check" size={24} color="#000" />
                Mark all 
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => console.log('Deleted all')}>
            <Text>
              <MaterialCommunityIcons name="delete-outline" size={24} color="#000" />
              Delete all
            </Text>
          </TouchableOpacity>
        </View>


          <SwipeListView 
            data={taskItems} 
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            leftOpenValue={75}
            rightOpenValue={-150}
            disableRightSwipe
            leftActivationValue={100}
            rightActivationValue={-200}
            leftActionValue={0}
            rightActionValue={-500}

            style={{...styles.items, height:'80%'}}
        />

      </View>

      {/*Escribir una task*/}
      <KeyboardAvoidingView
        behavior={Platform.OS==="ios"?"padding" : "height"}
        style={styles.writeTaskWrapper}
      >

        <View style={{
              bottom:70,
              paddingHorizontal: 30,
              width: '100%',
              display: isColorActive ? 'flex': 'none' ,
            }}>
          <ColorPicker
              discrete={true}
              swatchesOnly={true}
              onColorChange={color => handleColorChoose(color)}
            />
        </View>

      </KeyboardAvoidingView>

      <KeyboardAvoidingView 
        behavior={Platform.OS==="ios"?"padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <TextInput style={styles.input} placeholder={'Tarea rápida'} value={task} onChangeText={text =>setTask(text)}></TextInput>
        
        <TouchableOpacity onPress={() => handleAddColor()}>
          <View style={
            {
              width: 55, 
              height: 55,
              backgroundColor: color,
              borderRadius: 60,
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: '#C0C0C0',
              borderWidth: 1,
            }}>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleAddTask()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>

      </KeyboardAvoidingView> 

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  tasksWrapper:{
    paddingTop: 80,
    paddingHorizontal: 20,

  },
  sectionTittle:{
    fontSize: 28,
    fontWeight: 'bold'
  },
  items:{
    marginTop: 30,

  },
  writeTaskWrapper:{
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    width: 250,
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addWrapper: {
    width: 55, 
    height: 55,
    backgroundColor: '#fff',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
    
  },
  addText:{

  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    margin: 5,
    marginBottom: 15,
    borderRadius: 5,
  },
  backRightBtn: {
    alignItems: 'flex-end',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
    paddingRight: 17,
  },
  backRightBtnLeft: {
    backgroundColor: '#1f65ff',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  trash: {
    height: 25,
    width: 25,
    marginRight: 7,
  },
});

const taskStyles = StyleSheet.create({
  item: {
      backgroundColor:'#fff',
      padding:15,
      borderRadius: 10, 
      marginBottom: 14,
  },
  itemInside:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap'
  },
  square: {
      width: 24,
      height: 24,
      borderColor: '#55BCF6',
      borderWidth: 2,
      //backgroundColor: '#55BCF6',
      opacity: 0.4,
      borderRadius: 5,
      marginRight: 15,
  },
  squareDeleted: {
      width: 24,
      height: 24,
      backgroundColor: '#55BCF6',
      opacity: 0.4,
      borderRadius: 5,
      marginRight: 15,
  },
  itemText: {
      maxWidth: '80%',
  },
  itemTextDeleted: {
      textDecorationLine: 'line-through',
      color: 'gray'
  },
  circular: (color) => { 
      return {
          width: 12,
          height: 12,
          borderColor: color, //'#55BCF6',
          borderWidth: 2,
          borderRadius: 5,
      }
  },
});