import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  RefreshControl,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Lightbulb,
  HelpCircle,
  Zap,
} from 'lucide-react-native';
import { CallPreview } from '@/components/CallPreview';
import { ProgressBar } from '@/components/ProgressBar';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI assistant. I can help you with weather information, general questions, and more. How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCallPreview, setShowCallPreview] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Activate only for an upward swipe that is primarily vertical
        return gestureState.dy < -10 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderMove: (evt, gestureState) => {
        const pullUpDistance = -gestureState.dy; // dy is negative on pull up
        const maxPullDistance = 500; // Further increased for a longer, more deliberate gesture
        const progress = Math.min(100, (pullUpDistance / maxPullDistance) * 100);
        progressAnim.setValue(progress);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const currentProgress = (progressAnim as any)._value;

        if (currentProgress >= 99) {
          setShowCallPreview(true);
        }

        // Always animate back to 0 on release
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText.trim());
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Weather-related responses
    if (input.includes('weather') || input.includes('temperature') || input.includes('forecast')) {
      const responses = [
        "I can help you with weather information! The weather app shows current conditions, forecasts, and detailed weather data. You can search for any city or use your current location.",
        "Weather information is available in the main Weather tab. You can check current conditions, hourly forecasts, and get detailed weather insights for any location.",
        "For real-time weather data, check the Weather tab. You can search for cities, view forecasts, and get detailed weather analytics.",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // General help
    if (input.includes('help') || input.includes('what can you do')) {
      return "I can help you with:\n• Weather information and forecasts\n• General questions and assistance\n• App navigation and features\n• Tips and recommendations\n\nJust ask me anything!";
    }
    
    // Greetings
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Hello! 👋 How can I assist you today? I'm here to help with weather info, general questions, or anything else you need!";
    }
    
    // App features
    if (input.includes('app') || input.includes('features') || input.includes('tabs')) {
      return "This weather app has several great features:\n• Weather: Current conditions and detailed weather data\n• Forecast: Extended weather predictions\n• Chat: That's me! I'm here to help\n• Settings: Customize your experience\n\nExplore each tab to discover all the features!";
    }
    
    // Default responses
    const defaultResponses = [
      "That's an interesting question! I'm here to help you with weather information and general assistance. Feel free to ask me anything!",
      "I'd be happy to help with that! You can ask me about weather, app features, or any general questions you might have.",
      "Thanks for your message! I'm your AI assistant and I'm here to help. What would you like to know more about?",
      "I'm here to assist you! Whether it's weather information, app help, or general questions, I'm ready to help.",
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessageContainer : styles.aiMessageContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          message.isUser ? styles.userBubble : styles.aiBubble,
        ]}
      >
        {!message.isUser && (
          <View style={styles.aiIconContainer}>
            <Bot size={16} color="#4facfe" />
          </View>
        )}
        <Text
          style={[
            styles.messageText,
            message.isUser ? styles.userMessageText : styles.aiMessageText,
          ]}
        >
          {message.text}
        </Text>
        <Text
          style={[
            styles.timestamp,
            message.isUser ? styles.userTimestamp : styles.aiTimestamp,
          ]}
        >
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Bot size={24} color="#ffffff" />
              <Text style={styles.headerTitle}>AI Assistant</Text>
            </View>
            <View style={styles.headerSubtitle}>
              <Sparkles size={16} color="#ffffff" />
              <Text style={styles.headerSubtitleText}>Powered by AI</Text>
            </View>
          </View>

          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messagesContent}
            scrollEventThrottle={16}
          >
            {messages.map(renderMessage)}
            
            {isTyping && (
              <View style={[styles.messageContainer, styles.aiMessageContainer]}>
                <View style={[styles.messageBubble, styles.aiBubble]}>
                  <View style={styles.aiIconContainer}>
                    <Bot size={16} color="#4facfe" />
                  </View>
                  <View style={styles.typingIndicator}>
                    <ActivityIndicator size="small" color="#4facfe" />
                    <Text style={styles.typingText}>AI is typing...</Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Drag area and Progress Bar */}
          <Animated.View style={styles.dragHandle} {...panResponder.panHandlers}>
            <ProgressBar progress={progressAnim} />
          </Animated.View>

          {/* Input Section */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Type your message..."
                placeholderTextColor="#8b9dc3"
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
                onSubmitEditing={handleSend}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  !inputText.trim() && styles.sendButtonDisabled,
                ]}
                onPress={handleSend}
                disabled={!inputText.trim()}
              >
                <Send size={20} color={inputText.trim() ? '#ffffff' : '#8b9dc3'} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
        {showCallPreview && <CallPreview onClose={() => setShowCallPreview(false)} />}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  headerSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSubtitleText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginLeft: 5,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  messageContainer: {
    marginBottom: 15,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    position: 'relative',
  },
  userBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomRightRadius: 5,
  },
  aiBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomLeftRadius: 5,
    backdropFilter: 'blur(10px)',
  },
  aiIconContainer: {
    position: 'absolute',
    top: -8,
    left: -8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#333333',
  },
  aiMessageText: {
    color: '#ffffff',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.6,
  },
  userTimestamp: {
    color: '#333333',
    textAlign: 'right',
  },
  aiTimestamp: {
    color: '#ffffff',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingText: {
    color: '#ffffff',
    fontSize: 14,
    fontStyle: 'italic',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: '#4facfe',
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(79, 172, 254, 0.3)',
  },
  dragHandle: {
    position: 'absolute',
    bottom: 80, // Position it above the text input
    left: 0,
    right: 0,
    height: 120, // A generous height to make it easy to grab
    justifyContent: 'flex-end',
  },
}); 