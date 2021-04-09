
import React, {useState, useEffect} from 'react';
//importing RN components
import {
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
  TextInput, 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import ListTasks from './components/task';

export default function App() {

//tasks state variable that is created and set as an empty array
const [tasks,set] =  useState([]);
//function to obtain the Tasks stored in Async Storage
const getTasks = async () => { const theTasks = await AsyncStorage.getItem("tasks"); if(theTasks == null){set([]);}else{ set(JSON.parse(theTasks))}}
//function to store the in Async Storage
const updateTaskList = async (theTasks) => {await AsyncStorage.setItem('tasks',JSON.stringify(theTasks));};
//run getTasks once
useEffect(()=>{getTasks();}, {});
 //state (data storage)useState creates a state variable and a function to set this variable  hooking into React features, adding a state to function compoenents
//['getStateVariable', 'setStateVariable']   
const [selectedTask, setSelected] = useState({ keyValue: 0,disableButton:"Both", selected:false});
const [boolAddTask, setboolAddTask] = useState(false);
const [newTask, setNewTask] = useState("");
const[disableInsert, setDisableInsert] = useState(false);
const[lastPress, setLastPress] = useState(0);

//method for list item single click/double click
const handlePress = (key) => {
  let boolSetStrike = false;
  //obtain current tasks
  var theTasks = Object.assign([], tasks);
  //find the time difference between the current press and the last press
  var currentDateTime = new Date().getTime() - lastPress;
  //if less than specified double click time value and the task clicked is the same as previously clicked
  //make sure to set strikethrough for task
  if (currentDateTime < 250 && selectedTask.keyValue == key){
  boolSetStrike = true;    
  }
  //sets the lastPress state variable to the current date time
  setLastPress(new Date().getTime());
  //set task state variable 
  set(() => {
    //set task object properties based on the outcome of the click
    for(let aTask of theTasks){
      if(aTask.key == key){
        if(boolSetStrike){
          if(aTask.strike){
            aTask.strike =false;
          }else{
            aTask.strike = true;
          }
        }
        //set selected item object properties based on task position and amount of tasks.
        if((key == 1 || 0 ) && key == tasks.length){
          setSelected({keyValue: key,disableButton:"Both",selected:true});
        }
        else if(key == 1 || 0 ){
          setSelected({keyValue: key,disableButton:"Up",selected:true});
        }else if (key == tasks.length){
          setSelected({keyValue: key,disableButton:"Down",selected:true});
        }else{
          setSelected({keyValue: key,disableButton:"",selected:true});
        }
      }
    }//end for
  //update task list in AsyncStorage if there was a double click
  if(boolSetStrike){
  updateTaskList(theTasks);
  }
  //return tasks to be used in the setting of the task state variable\
  return theTasks;
  });//end set inner function
};//end handlePress()
 
//move task down the list
function changeDown(){
  let num = 1
  let sortedTaskList =  Object.assign([], tasks); 
  let otherIndex = 0;

  //switch the task description and strike through value with the task below it.
  for(let i = 0; i < sortedTaskList.length; i++){
     if(sortedTaskList[i].key == selectedTask.keyValue)
     {
       otherIndex = i + num;
       let aTask = sortedTaskList[i].task;
       let aStrike = sortedTaskList[i].strike;
       sortedTaskList[i].task = sortedTaskList[otherIndex].task;
       sortedTaskList[i].strike = sortedTaskList[otherIndex].strike;
       sortedTaskList[otherIndex].task = aTask;
       sortedTaskList[otherIndex].strike = aStrike;
       updateTaskList(sortedTaskList);
       handlePress(otherIndex + num);  
       break;
      }//end if
    } //end for
  }//end changeDown()

//move task up the list
function changeUp(){
    let num = -1;
    let sortedTaskList =  Object.assign([], tasks); 
    let otherIndex = 0;
    for(let i = 0; i < sortedTaskList.length; i++){
       if(sortedTaskList[i].key == selectedTask.keyValue)
       {
         otherIndex = i + num;
         let aTask = sortedTaskList[i].task;
         let aStrike = sortedTaskList[i].strike;
         sortedTaskList[i].task = sortedTaskList[otherIndex].task;
         sortedTaskList[i].strike = sortedTaskList[otherIndex].strike;
         sortedTaskList[otherIndex].task = aTask;
        sortedTaskList[otherIndex].strike = aStrike;
        updateTaskList(sortedTaskList);
        handlePress(otherIndex - num);  
         break;
        }//end if
      } //end for
      
}//end changeUp()

const
addTask = () =>{
  cancelAddTask;
  let newKey = 1;
  let newTasks = [];
  if(tasks.length > 0){
  newTasks = tasks;
  newKey =tasks.length + 1;
  }
  newTasks.push({task:newTask,strike:false, key:newKey});
  set(newTasks);
  updateTaskList(newTasks);
  setboolAddTask(false); setNewTask(""); setDisableInsert(false);
},

deleteTask = () =>{
  let newTasks = tasks.filter(aTask => aTask.key != selectedTask.keyValue);
  for(let i = 0; i < newTasks.length; i++){
  newTasks[i].key = i+1;
  }
  set(newTasks);
  updateTaskList(newTasks);
  setSelected({keyValue: 0,disableButton:"Both", selected: false});
},
//set state variables that controls whether the add task controls and input are shown
showAddTask = () => {setboolAddTask(true)},  
//hides/resets the add task input and control state variables
cancelAddTask = () => {setboolAddTask(false); setNewTask(""); setDisableInsert(false)},
//function that sets the newtask state variable on every string change, if empty disable the task insert button
handleChange = (text) =>{setNewTask(text); if(text!=""){setDisableInsert(true)}else{setDisableInsert()}}; 

return (
<View style={styles.sectionContainer}>
  <Text style={styles.headerTitle}>
    To Do List
  </Text>
  <View style={styles.controlPanel}>
      <View style={styles.Button}>
          <Button 
                title="Add"
                color="green"
                onPress={showAddTask}          
          />
      </View>
      <View style={styles.Button}>
        {
        selectedTask.selected ? <Button onPress = {deleteTask}
        title="Delete"
        color="green"
  /> : <Button disabled={true}
        title="Delete"
        color="green"
        />
        }    
      </View>
      <View style={styles.Button}>
        {
          selectedTask.selected && selectedTask.disableButton != "Up" &&  selectedTask.disableButton != "Both" ?   <Button 
          onPress={changeUp}
          title="Up"
          color="green"
   /> :
   <Button disabled={true}
   title="Up"
   color="green"
/>
        }        
      </View>
      <View style={styles.Button}>
        {   
          selectedTask.selected && selectedTask.disableButton != "Down" &&  selectedTask.disableButton != "Both" ?  <Button    
          title="Down"
          color="green"
          onPress={changeDown}
/> :  <Button 
disabled={true}
                title="Down"
                color="green"
     /> 
        }  
      </View>
  </View>
  {/* end control Panel */}
{
//if Add button was clicked display add task controls and input
boolAddTask ? <View><Text>Please Enter Task</Text><View><TextInput style={styles.input} value={newTask} onChangeText={(text) => handleChange(text)} autoFocus={true}/></View><View style={styles.showAddTask}><View style={styles.Button}>{disableInsert ? <Button onPress={addTask}   title="Insert" color="green"/> : <Button disabled={true} title="Insert" color="green"/>}</View><View style={styles.Button}><Button title="Cancel" color="green" onPress={cancelAddTask}/></View></View></View> : null
}
  <View style={styles.listContainer}>
    <FlatList 
    data={tasks}
    renderItem={({ item } ) => (<ListTasks item={item} selectedItem={selectedTask} handlePress={handlePress}/>)}
    />
  </View>
</View>
);
}

//StyleSheet
const styles = StyleSheet.create({
  input:{
    borderWidth:2,
    padding:1,
    paddingLeft: 2,
  },
  showAddTask: {
    flexDirection:'row'
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  headerTitle:{
    fontSize: 30,
    fontWeight: '600',
    color: Colors.black,
    textAlign: 'center'
  },
  controlPanel: {
    
    flexDirection:'row',  
    justifyContent:'center'
  },
  Button:{
   borderWidth: 2, 
   borderRadius:8,
   width:'27%',
   margin:1,
  },
  listContainer:{
fontSize:16,
fontWeight: '600',
color: 'black'
  },
  task:{
   // textDecorationLine:'underline'
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

