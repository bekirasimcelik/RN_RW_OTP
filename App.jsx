import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Image,
} from 'react-native';
import RNOtpVerify from 'react-native-otp-verify';
// import MessageIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const OtpAutoRead = () => {
  const [otp, setOtp] = useState('');

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestSmsPermission();
      RNOtpVerify.getHash().then(console.log).catch(console.error);

      RNOtpVerify.getOtp()
        .then(p => RNOtpVerify.addListener(otpHandler))
        .catch(error => {
          console.error('OTP dinleyicisi başlatılamadı:', error);
        });

      return () => RNOtpVerify.removeListener();
    }
  }, []);

  const requestSmsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        {
          title: 'SMS İzni',
          message:
            'Bu uygulama SMS mesajlarını okumak için izne ihtiyaç duyuyor.',
          buttonNeutral: 'Daha Sonra',
          buttonNegative: 'İptal',
          buttonPositive: 'Tamam',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('SMS okuma izni verildi.');
      } else {
        console.log('SMS okuma izni reddedildi.');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const otpHandler = message => {
    console.log('Gelen mesaj:', message);
    const otpMatch = /(\d{6})/.exec(message);
    if (otpMatch) {
      const otp2 = otpMatch[1];
      setOtp(otp2);
    } else {
      console.warn('Mesajdan OTP çıkarılamadı veya mesaj formatı uygun değil.');
    }
  };

  const handleOtpChange = (text, index) => {
    let newOtp = otp ? otp.split('') : [];
    newOtp[index] = text;
    setOtp(newOtp.join(''));
  };

  return (
    <View className="flex-1 p-16 bg-[#EA9745]">
      <Text className="text-[20px] mt-10 text-white self-center">
        Enter Verification Code
      </Text>

      <View className="flex justify-center items-center mt-10">
        {/* <MessageIcon name="message-bulleted" size={50} /> */}
        <Image
          source={require('./src/assets/otpIcon.png')}
          style={{width: 125, height: 125}}
        />
      </View>

      <View className="flex flex-row justify-between my-[40]">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <TextInput
              key={index}
              className="border-white bprder-2 rounded-md w-10 h-10 text-center text-[18px] bg-white"
              maxLength={1}
              keyboardType="numeric"
              value={(otp && otp[index]) || ''}
              onChangeText={text => handleOtpChange(text, index)}
            />
          ))}
      </View>

      <Button
        title="Doğrula"
        onPress={() => otp && console.log('OTP Doğrulandı:', otp)}
      />
    </View>
  );
};

export default OtpAutoRead;
