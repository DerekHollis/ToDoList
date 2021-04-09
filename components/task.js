import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

//ListTasks  Component renders each task that is stored in the tasks state variable, styling the task based on the properties values of the task
export default function ListTasks({ item, selectedItem, handlePress }){
return (  
<TouchableOpacity onPress={() => handlePress(item.key)}>
   {item.key == selectedItem.keyValue && item.strike ? <Text style={styles.itemHighlightedCross}>{item.task}</Text> : item.key == selectedItem.keyValue ? <Text style={styles.itemHighlighted}>{item.task} </Text>  : item.strike ? <Text style={styles.itemCross}>{item.task} </Text> :  <Text style={styles.item}>{item.task}</Text> }
  </TouchableOpacity>
)
};//end ListTasks

//Styles
const styles = StyleSheet.create({
item: {
    marginTop: 6, 
    backgroundColor:'orange',
    borderBottomColor: 'black',
    borderWidth: 2,
    padding: 2,
    paddingLeft: 5 

},
itemCross: {
    marginTop: 6, 
    backgroundColor:'orange',
    borderBottomColor: 'black',
    borderWidth: 2,
    padding: 2,
    paddingLeft: 5,
     textDecorationLine:  'line-through',
     textDecorationStyle:'solid'
},
itemHighlighted: {
    marginTop: 6, 
    backgroundColor:'yellow',
    borderBottomColor: 'black',
    borderWidth: 2,
    padding: 2,
    paddingLeft: 5 
},
itemHighlightedCross: {
    marginTop: 6, 
    backgroundColor:'yellow',
    borderBottomColor: 'black',
    borderWidth: 2,
    padding: 2,
    paddingLeft: 5,
    textDecorationLine:  'line-through',
    textDecorationStyle:'solid'
}
});