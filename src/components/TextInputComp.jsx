import React from 'react';
import {TextInput} from 'react-native';

const TextInputComp = ({value, onChangeText, index}) => {
  return (
    <TextInput
      key={index}
      className="border-white bprder-2 rounded-md w-10 h-10 text-center text-[18px] bg-white"
      maxLength={1}
      keyboardType="numeric"
      value={value}
      onChangeText={text => onChangeText(text, index)}
    />
  );
};

export default TextInputComp;
