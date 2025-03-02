import React from 'react';
import { TextInput, StyleSheet } from 'react-native';


//the input component
const DyInput = ({ placeholder, value, onChangeText, keyboardType}) => {
  return (
    <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            autoCapitalize="none"
    />
  );
};


//style
const styles = StyleSheet.create({
  text: {
    fontSize: 10,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: 8,
    marginBottom: 15,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    backgroundColor: '#bac0c7',
  }
});

export default DyInput;