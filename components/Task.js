import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated, TouchableHighlight} from 'react-native';


export const TaskDeleted = props => {
    const {
        data,
        rowHeightAnimatedValue,
        removeRow,
        leftActionState,
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
        <Animated.View>
            <TouchableHighlight 
                onPress={() => console.log('Element touched')}
                underlayColor={'#aaa'}
            >
                <View style={styles.item}>
                    <View style={styles.itemLeft}>
                    <TouchableOpacity onPress={() => data.item.onpress()}>  
                        <View style={styles.squareDeleted}></View>
                    </TouchableOpacity>
                        <Text style={styles.itemTextDeleted}>{data.item.text}</Text>
                    </View>
                    <View style={styles.circular(data.item.color)}></View>
                </View>

            </TouchableHighlight>
        </Animated.View>
    )
}

export const Task = props => {
    const {
        data,
        rowHeightAnimatedValue,
        removeRow,
        leftActionState,
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
        <Animated.View>
            <TouchableHighlight 
                onPress={() => console.log('Element touched')}
                underlayColor={'#aaa'}
            >
                <View style={styles.item}>
                    <View style={styles.itemLeft}>
                    <TouchableOpacity style={{
                            zIndex: 15,
                            elevation: (Platform.OS === 'android') ? 50 : 0
                        }} onPress={data.item.onpress}>
                        <View style={styles.square}></View>
                    </TouchableOpacity>
                        <Text style={styles.itemText}>{data.item.text}</Text>
                    </View>
                    <View style={styles.circular(data.item.color)}></View>
                </View>
            </TouchableHighlight>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    item: {
        backgroundColor:'#fff',
        padding:15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
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
