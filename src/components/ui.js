import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, fonts, radius, shadow, spacing } from '../theme';

export function Screen({ children, scroll = false, contentContainerStyle, style }) {
  const content = scroll ? (
    <ScrollView contentContainerStyle={[styles.scrollContent, contentContainerStyle]}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.screenContent, contentContainerStyle]}>{children}</View>
  );

  return (
    <LinearGradient
      colors={[colors.background, '#EFE5D2', '#F8F5EE']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.screen, style]}
    >
      {content}
    </LinearGradient>
  );
}

export function AppCard({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function PrimaryButton({ title, onPress, disabled, tone = 'primary', style }) {
  const palette = tone === 'danger'
    ? [colors.red500, '#B91C1C']
    : tone === 'secondary'
      ? [colors.ink700, colors.ink900]
      : [colors.teal600, colors.ink700];

  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }]}>
      <LinearGradient
        colors={disabled ? [colors.slate300, colors.slate300] : palette}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.button, style]}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
}

export function GhostButton({ title, onPress, style, danger = false }) {
  return (
    <Pressable onPress={onPress} style={[styles.ghostButton, danger && styles.ghostButtonDanger, style]}>
      <Text style={[styles.ghostButtonText, danger && { color: colors.red500 }]}>{title}</Text>
    </Pressable>
  );
}

export function AppInput({ label, ...props }) {
  return (
    <View style={styles.inputGroup}>
      {label ? <Text style={styles.inputLabel}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.slate500}
        {...props}
        style={[styles.input, props.style]}
      />
    </View>
  );
}

export function LoadingBlock({ message = 'Carregando...' }) {
  return (
    <Screen contentContainerStyle={styles.centered}>
      <ActivityIndicator size="large" color={colors.teal600} />
      <Text style={styles.loadingText}>{message}</Text>
    </Screen>
  );
}

export function EmptyState({ title, description }) {
  return (
    <AppCard style={styles.emptyCard}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyDescription}>{description}</Text>
    </AppCard>
  );
}

export function PillSelector({ options, value, onChange }) {
  return (
    <View style={styles.pillWrap}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.pill, active && styles.pillActive]}
          >
            <Text style={[styles.pillText, active && styles.pillTextActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function SelectModal({ visible, title, options, onSelect, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{title}</Text>
          <ScrollView style={{ maxHeight: 360 }}>
            {options.map((option) => (
              <Pressable key={option.value} style={styles.modalItem} onPress={() => onSelect(option.value)}>
                <Text style={styles.modalItemText}>{option.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <GhostButton title="Fechar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

export function SettingRow({ title, description, value, onValueChange, onPress }) {
  const content = (
    <AppCard style={styles.settingCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description ? <Text style={styles.settingDescription}>{description}</Text> : null}
      </View>
      {typeof value === 'boolean' ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          thumbColor={colors.paper}
          trackColor={{ false: colors.slate300, true: colors.teal500 }}
        />
      ) : (
        <Text style={styles.settingArrow}>›</Text>
      )}
    </AppCard>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  screenContent: {
    flex: 1,
    padding: spacing.lg,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(15, 118, 110, 0.08)',
    ...shadow,
  },
  button: {
    borderRadius: radius.pill,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  ghostButton: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.slate300,
    backgroundColor: colors.paper,
  },
  ghostButtonDanger: {
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  ghostButtonText: {
    color: colors.ink900,
    fontSize: 15,
    fontWeight: '600',
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    color: colors.ink800,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  input: {
    minHeight: 54,
    backgroundColor: colors.paper,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.slate200,
    paddingHorizontal: spacing.md,
    color: colors.ink900,
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    color: colors.ink800,
    fontSize: 15,
  },
  emptyCard: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    color: colors.ink900,
    fontSize: 20,
    fontWeight: '700',
    fontFamily: fonts.heading,
  },
  emptyDescription: {
    color: colors.slate500,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  pillWrap: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.06)',
    borderRadius: radius.pill,
    padding: 4,
    gap: 4,
  },
  pill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  pillActive: {
    backgroundColor: colors.ink900,
  },
  pillText: {
    color: colors.ink800,
    fontWeight: '700',
  },
  pillTextActive: {
    color: colors.white,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  modalTitle: {
    color: colors.ink900,
    fontFamily: fonts.heading,
    fontSize: 24,
  },
  modalItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate100,
  },
  modalItemText: {
    color: colors.ink900,
    fontSize: 16,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingTitle: {
    color: colors.ink900,
    fontSize: 16,
    fontWeight: '700',
  },
  settingDescription: {
    color: colors.slate500,
    marginTop: 4,
    lineHeight: 20,
  },
  settingArrow: {
    color: colors.teal700,
    fontSize: 26,
    marginTop: -4,
  },
});
