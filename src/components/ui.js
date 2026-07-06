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
    <ScrollView
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.contentShell}>{children}</View>
    </ScrollView>
  ) : (
    <View style={[styles.screenContent, contentContainerStyle]}>
      <View style={styles.contentShell}>{children}</View>
    </View>
  );

  return (
    <LinearGradient
      colors={[colors.background, '#F3E8D3', '#FBF7EF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.screen, style]}
    >
      <View style={styles.bgOrbTop} />
      <View style={styles.bgOrbBottom} />
      {content}
    </LinearGradient>
  );
}

export function AppCard({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionHeader({ eyebrow, title, description, style }) {
  return (
    <View style={[styles.sectionHeader, style]}>
      {eyebrow ? <Text style={styles.sectionEyebrow}>{eyebrow}</Text> : null}
      {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
      {description ? <Text style={styles.sectionDescription}>{description}</Text> : null}
    </View>
  );
}

export function MetricCard({ label, value, tone = 'teal', style }) {
  const accentColor = tone === 'amber' ? colors.amber600 : tone === 'coral' ? colors.coral500 : colors.teal700;

  return (
    <AppCard style={[styles.metricCard, style]}>
      <View style={[styles.metricAccent, { backgroundColor: accentColor }]} />
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </AppCard>
  );
}

export function PrimaryButton({ title, onPress, disabled, tone = 'primary', style }) {
  const palette = tone === 'danger'
    ? [colors.red500, '#B91C1C']
    : tone === 'secondary'
      ? [colors.ink700, colors.ink950]
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
      <View style={styles.loadingCircle}>
        <ActivityIndicator size="large" color={colors.teal600} />
      </View>
      <Text style={styles.loadingText}>{message}</Text>
    </Screen>
  );
}

export function EmptyState({ title, description }) {
  return (
    <AppCard style={styles.emptyCard}>
      <View style={styles.emptyBadge}>
        <Text style={styles.emptyBadgeText}>SEM DADOS</Text>
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyDescription}>{description}</Text>
    </AppCard>
  );
}

export function StatusBanner({ title, message, tone = 'info', actionLabel, onAction }) {
  const toneStyle = tone === 'error'
    ? styles.statusError
    : tone === 'success'
      ? styles.statusSuccess
      : styles.statusInfo;

  return (
    <AppCard style={[styles.statusCard, toneStyle]}>
      {title ? <Text style={styles.statusTitle}>{title}</Text> : null}
      {message ? <Text style={styles.statusMessage}>{message}</Text> : null}
      {actionLabel && onAction ? (
        <GhostButton title={actionLabel} onPress={onAction} style={styles.statusAction} />
      ) : null}
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
          <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
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
        <Text style={styles.settingArrow}>{'>'}</Text>
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
  bgOrbTop: {
    position: 'absolute',
    top: -120,
    right: -50,
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
  },
  bgOrbBottom: {
    position: 'absolute',
    bottom: -80,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: 'rgba(20, 184, 166, 0.10)',
  },
  screenContent: {
    flex: 1,
    padding: spacing.lg,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
  },
  contentShell: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    ...shadow,
  },
  sectionHeader: {
    gap: spacing.xs,
  },
  sectionEyebrow: {
    color: colors.amber700,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: colors.ink900,
    fontFamily: fonts.heading,
    fontSize: 32,
    lineHeight: 40,
  },
  sectionDescription: {
    color: colors.slate500,
    lineHeight: 22,
    maxWidth: 560,
  },
  metricCard: {
    minHeight: 112,
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceStrong,
  },
  metricAccent: {
    width: 44,
    height: 6,
    borderRadius: radius.pill,
  },
  metricLabel: {
    color: colors.slate500,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  metricValue: {
    color: colors.ink900,
    fontFamily: fonts.heading,
    fontSize: 22,
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
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  ghostButton: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.slate300,
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
  ghostButtonDanger: {
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  ghostButtonText: {
    color: colors.ink900,
    fontSize: 15,
    fontWeight: '700',
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    color: colors.ink800,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  input: {
    minHeight: 56,
    backgroundColor: colors.paper,
    borderRadius: radius.md,
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
  loadingCircle: {
    width: 92,
    height: 92,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    ...shadow,
  },
  loadingText: {
    color: colors.ink800,
    fontSize: 15,
    textAlign: 'center',
  },
  emptyCard: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xxl,
    backgroundColor: colors.surfaceStrong,
  },
  emptyBadge: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    backgroundColor: colors.ink900,
  },
  emptyBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  emptyTitle: {
    color: colors.ink900,
    fontSize: 20,
    fontWeight: '700',
    fontFamily: fonts.heading,
    textAlign: 'center',
  },
  emptyDescription: {
    color: colors.slate500,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  statusCard: {
    gap: spacing.sm,
  },
  statusInfo: {
    borderColor: 'rgba(15, 118, 110, 0.18)',
    backgroundColor: '#F0FDFA',
  },
  statusSuccess: {
    borderColor: 'rgba(22, 163, 74, 0.18)',
    backgroundColor: '#F0FDF4',
  },
  statusError: {
    borderColor: 'rgba(220, 38, 38, 0.16)',
    backgroundColor: '#FEF2F2',
  },
  statusTitle: {
    color: colors.ink900,
    fontWeight: '800',
    fontSize: 16,
  },
  statusMessage: {
    color: colors.ink800,
    lineHeight: 21,
  },
  statusAction: {
    alignSelf: 'flex-start',
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
    paddingVertical: 12,
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
    borderRadius: radius.xl,
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
    fontSize: 22,
    fontWeight: '800',
  },
});
