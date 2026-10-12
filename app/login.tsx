import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSignIn, useSignUp } from '@clerk/expo';
import { Button, Field, Message, shared } from '../src/components/ui';
import { useApp } from '../src/providers/app-provider';

type AuthMode = 'sign-in' | 'sign-up' | 'verify-email';

export default function LoginScreen() {
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const { isLoading, setGuestSession, clearGuestSession } = useApp();
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async () => {
    if (!signIn || !email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const { error: signInError } = await signIn.password({
        identifier: email.trim(),
        password,
      });
      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (signIn.status !== 'complete') {
        setError('This account requires an additional verification step that is not supported yet.');
        return;
      }

      const { error: finalizeError } = await signIn.finalize();
      if (finalizeError) {
        setError(finalizeError.message);
        return;
      }

      clearGuestSession();
      router.replace('/');
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async () => {
    if (!signUp || !email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const { error: signUpError } = await signUp.password({
        emailAddress: email.trim(),
        password,
      });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      const { error: sendCodeError } = await signUp.verifications.sendEmailCode();
      if (sendCodeError) {
        setError(sendCodeError.message);
        return;
      }

      setMode('verify-email');
    } catch (signUpError) {
      setError(signUpError instanceof Error ? signUpError.message : 'Unable to create an account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!signUp || !verificationCode.trim()) {
      setError('Enter the verification code from your email.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const { error: verificationError } = await signUp.verifications.verifyEmailCode({
        code: verificationCode.trim(),
      });
      if (verificationError) {
        setError(verificationError.message);
        return;
      }

      const { error: finalizeError } = await signUp.finalize();
      if (finalizeError) {
        setError(finalizeError.message);
        return;
      }

      clearGuestSession();
      router.replace('/');
    } catch (verificationError) {
      setError(verificationError instanceof Error ? verificationError.message : 'Unable to verify your email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuest = async () => {
    setError('');
    try {
      await setGuestSession();
      router.replace('/');
    } catch (guestSessionError) {
      setError(guestSessionError instanceof Error ? guestSessionError.message : 'Unable to start guest mode.');
    }
  };

  if (isLoading) {
    return (
      <View style={[shared.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#244F3D" />
      </View>
    );
  }

  const title = mode === 'verify-email'
    ? 'Check your email'
    : mode === 'sign-up'
      ? 'Create your account'
      : 'Welcome back';

  return (
    <View style={shared.screen}>
      <Text style={shared.title}>Gav List</Text>
      <Text style={shared.caption}>
        {mode === 'verify-email'
          ? `Enter the verification code sent to ${email.trim()}.`
          : 'Keep your places private, or try the local guest demo.'}
      </Text>

      <View style={{ gap: 16, marginTop: 24 }}>
        <Text style={shared.sectionTitle}>{title}</Text>
        {mode === 'verify-email' ? (
          <>
            <Field
              label="Verification code"
              value={verificationCode}
              onChangeText={setVerificationCode}
              placeholder="Enter the code from your email"
              keyboardType="number-pad"
              autoCapitalize="none"
            />
            <Button
              title={isSubmitting ? 'Verifying…' : 'Verify email'}
              onPress={() => void handleVerifyEmail()}
              disabled={isSubmitting}
            />
          </>
        ) : (
          <>
            <Field
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="email@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Field
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              autoCapitalize="none"
            />
            <Button
              title={isSubmitting ? 'Please wait…' : mode === 'sign-up' ? 'Create account' : 'Sign in'}
              onPress={() => void (mode === 'sign-up' ? handleSignUp() : handleSignIn())}
              disabled={isSubmitting}
            />
            <Pressable
              disabled={isSubmitting}
              onPress={() => {
                setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in');
                setError('');
              }}
            >
              <Text style={{ color: '#244F3D', fontWeight: '700', textAlign: 'center' }}>
                {mode === 'sign-up' ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
              </Text>
            </Pressable>
            <View nativeID="clerk-captcha" />
          </>
        )}
        {mode === 'verify-email' ? (
          <Pressable
            disabled={isSubmitting}
            onPress={() => {
              setMode('sign-up');
              setVerificationCode('');
              setError('');
            }}
          >
            <Text style={{ color: '#244F3D', fontWeight: '700', textAlign: 'center' }}>
              Back to sign up
            </Text>
          </Pressable>
        ) : null}
        {error ? <Message text={error} kind="error" /> : null}
        {mode !== 'verify-email' ? (
          <Button
            title="Continue as guest"
            onPress={() => void handleGuest()}
            disabled={isSubmitting}
          />
        ) : null}
      </View>
    </View>
  );
}
