import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  PermissionsAndroid,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import RNOtpVerify from 'react-native-otp-verify';
import {useTranslation} from 'react-i18next';
import './src/lang/i18n';
import TextInputComp from './src/components/TextInputComp';

const OtpAutoRead = () => {
  const {t, i18n} = useTranslation();
  const [otp, setOtp] = useState('');

  const changeLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'tr' : 'en';
    i18n.changeLanguage(newLanguage);
  };

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
          title: t('sms_permission_title'),
          message: t('sms_permission_message'),
          buttonNeutral: t('button_neutral'),
          buttonNegative: t('button_negative'),
          buttonPositive: t('button_positive'),
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log(t('sms_permission_granted'));
      } else {
        console.log(t('sms_permission_denied'));
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const otpHandler = message => {
    console.log(t('received_message'), message);
    const otpMatch = /(\d{6})/.exec(message);
    if (otpMatch) {
      const otp2 = otpMatch[1];
      setOtp(otp2);
    } else {
      console.warn(t('otp_not_found'));
    }
  };

  const handleOtpChange = (text, index) => {
    let newOtp = otp ? otp.split('') : [];
    newOtp[index] = text;
    setOtp(newOtp.join(''));
  };

  return (
    <View className="flex-1 p-16 bg-[#EA9745]">
      {/* Dil Değiştirme Butonu */}
      <TouchableOpacity
        onPress={changeLanguage}
        style={{position: 'absolute', top: 10, right: 10}}>
        <Text style={{color: 'white'}}>
          {i18n.language === 'en' ? 'TR' : 'EN'}
        </Text>
      </TouchableOpacity>

      <Text className="text-[20px] mt-10 text-white self-center">
        {t('enter_verification_code')}
      </Text>

      <View className="flex justify-center items-center mt-10">
        <Image
          source={require('./src/assets/otpIcon.png')}
          style={{width: 125, height: 125}}
        />
      </View>

      <View className="flex flex-row justify-between my-[40]">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <TextInputComp index={index} />
          ))}
      </View>

      <Button
        title={t('verify')}
        onPress={() => otp && console.log(t('otp_verified'), otp)}
      />
    </View>
  );
};

export default OtpAutoRead;
