import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';


//the button component
const DyButton = ({ text, onPress, backgroundColor = '#007BFF', textColor = '#FFF' }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
    </TouchableOpacity>
  );
};


//style
const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DyButton;