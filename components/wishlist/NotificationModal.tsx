import React, { useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity, Platform, Modal, TextInput } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';
import { FontAwesome } from '@expo/vector-icons';

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
  productTitle: string;
  currentPrice: number;
  onSetAlert: (alert: { type: 'percentage' | 'price'; value: number }) => void;
  existingAlert?: {
    type: 'percentage' | 'price';
    value: number;
  };
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  onClose,
  productTitle,
  currentPrice,
  onSetAlert,
  existingAlert,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedType, setSelectedType] = useState<'percentage' | 'price'>(
    existingAlert?.type || 'percentage'
  );
  const [percentageValue, setPercentageValue] = useState(
    existingAlert?.type === 'percentage' 
      ? existingAlert.value.toString() 
      : '20'
  );
  const [priceValue, setPriceValue] = useState(
    existingAlert?.type === 'price'
      ? existingAlert.value.toString()
      : (currentPrice / 2).toFixed(2)
  );

  const handleSetAlert = () => {
    const value = selectedType === 'percentage' 
      ? Number(percentageValue)
      : Number(priceValue);
    
    if (!isNaN(value) && value > 0) {
      onSetAlert({ type: selectedType, value });
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: colors.background[isDark ? 'dark' : 'light'] },
          ]}>
          <View style={styles.modalHeader}>
            <Text
              style={[
                styles.modalTitle,
                { color: colors.text[isDark ? 'dark' : 'light'] },
              ]}>
              Price Alerts
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <FontAwesome name="close" size={24} color={colors.text[isDark ? 'dark' : 'light']} />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.productTitle,
              { color: colors.text[isDark ? 'dark' : 'light'] },
            ]}
            numberOfLines={2}>
            {productTitle}
          </Text>
          
          <View style={styles.alertTypeContainer}>
            <TouchableOpacity
              style={[
                styles.alertTypeButton,
                { borderColor: colors.border[isDark ? 'dark' : 'light'] },
                selectedType === 'percentage' && styles.alertTypeButtonActive,
              ]}
              onPress={() => setSelectedType('percentage')}>
              <Text style={[
                styles.alertTypeText,
                { color: colors.secondaryText[isDark ? 'dark' : 'light'] },
                selectedType === 'percentage' && styles.alertTypeTextActive,
              ]}>Percentage Off</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.alertTypeButton,
                { borderColor: colors.border[isDark ? 'dark' : 'light'] },
                selectedType === 'price' && styles.alertTypeButtonActive,
              ]}
              onPress={() => setSelectedType('price')}>
              <Text style={[
                styles.alertTypeText,
                { color: colors.secondaryText[isDark ? 'dark' : 'light'] },
                selectedType === 'price' && styles.alertTypeTextActive,
              ]}>Target Price</Text>
            </TouchableOpacity>
          </View>

          {selectedType === 'percentage' ? (
            <View style={styles.inputContainer}>
              <Text style={[
                styles.inputLabel,
                { color: colors.text[isDark ? 'dark' : 'light'] },
              ]}>Notify when discount is at least:</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    { color: colors.text[isDark ? 'dark' : 'light'] },
                  ]}
                  value={percentageValue}
                  onChangeText={setPercentageValue}
                  keyboardType="decimal-pad"
                  maxLength={5}
                  returnKeyType="done"
                  selectionColor={colors.primary}
                />
                <Text style={[
                  styles.inputSuffix,
                  { color: colors.text[isDark ? 'dark' : 'light'] },
                ]}>%</Text>
              </View>
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <Text style={[
                styles.inputLabel,
                { color: colors.text[isDark ? 'dark' : 'light'] },
              ]}>Notify when price drops below:</Text>
              <View style={styles.inputWrapper}>
                <Text style={[
                  styles.inputPrefix,
                  { color: colors.text[isDark ? 'dark' : 'light'] },
                ]}>$</Text>
                <TextInput
                  style={[
                    styles.input,
                    { color: colors.text[isDark ? 'dark' : 'light'] },
                  ]}
                  value={priceValue}
                  onChangeText={setPriceValue}
                  keyboardType="decimal-pad"
                  maxLength={10}
                  returnKeyType="done"
                  selectionColor={colors.primary}
                />
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.setAlertButton} onPress={handleSetAlert}>
            <FontAwesome name="bell" size={20} color={colors.primary} />
            <Text style={styles.setAlertButtonText}>Set Alert</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 16,
    padding: spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.title2,
    textAlign: 'left',
  },
  productTitle: {
    ...typography.body,
    marginBottom: spacing.lg,
    textAlign: 'left',
  },
  alertTypeContainer: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  alertTypeButton: {
    flex: 1,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    marginHorizontal: spacing.xs,
    borderRadius: 8,
  },
  alertTypeButtonActive: {
    borderColor: colors.primary,
  },
  alertTypeText: {
    ...typography.body,
  },
  alertTypeTextActive: {
    color: colors.primary,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.body,
    marginBottom: spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
  },
  input: {
    ...typography.body,
    flex: 1,
    padding: spacing.sm,
  },
  inputPrefix: {
    ...typography.body,
    marginRight: spacing.xs,
  },
  inputSuffix: {
    ...typography.body,
    marginLeft: spacing.xs,
  },
  setAlertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  setAlertButtonText: {
    ...typography.body,
    color: colors.primary,
    marginLeft: spacing.sm,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: spacing.xs,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 