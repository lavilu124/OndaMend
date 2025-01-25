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
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    backgroundColor: '#fff',
  }
});

export default DyInput;