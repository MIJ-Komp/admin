// src/plugins/vee-validate.js

import { defineRule } from 'vee-validate';
import helper from '../constant/helper'
import moment from 'moment'

const label = helper.GetLabel().error

// Mendefinisikan aturan validasi
defineRule('required', (value, [type]) => {
  if(type == "number"){
    const numericValue = Number(value);
    if (numericValue != 0 && (!numericValue || numericValue == null || numericValue.toString().trim().length == 0)) {
      return label.required;
    }
  }
  else{
    if (!value || value == null || value.toString().trim().length == 0) {
      return label.required;
    }
  }
  return true;
});

defineRule('email', value => {
  if (!value || !value.length) {
    return true;
  }
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if(!emailPattern.test(value))
    return label.email.replace('{value}', value);

  return true
});

defineRule('minLength', (value, [limit]) => {
  if (!value || !value.length) {
    return true;
  }
  if (value.length < limit) {
    return label.minLength.replace('{value}', limit);
  }
  return true;
});

defineRule('maxLength', (value, [limit]) => {
  if (!value || !value.length) {
    return true;
  }
  if (value.length > limit) {
    return label.maxLength.replace('{value}', limit);
  }
  return true;
});

defineRule('minMax', (value, [min, max]) => {
  const numericValue = Number(value);
  if (min && numericValue < min) {
    return label.min.replace('{value}', min);
  }
  if (max && numericValue > max) {
    return label.max.replace('{value}', max);
  }
  return true;
});

defineRule('mustStartWith', (value, [char]) => {
  if (!value.startsWith(char)){
    return `must start with "${char}"`
  }
  return true;
});

defineRule('minDate', (value, [limit]) => {
  if (!value) {
    return true;
  }
  console.log(value)
  console.log(new Date(value) < new Date(limit))
  
  if (new Date(value) < new Date(limit)) {
    return `harus lebih besar dari ${moment(limit).format("DD-MMM-yyyy")}`;
  }
  return true;
});

