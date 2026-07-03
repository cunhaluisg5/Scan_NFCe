import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

import { colors, fonts, radius, shadow, spacing } from '../theme';
import { formatCurrency } from '../utils/format';

function buildPath(points) {
  if (!points.length) {
    return '';
  }

  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');
}

export function SimpleLineChart({ labels, values, height = 220 }) {
  const width = 320;
  const padding = 24;
  const safeValues = values.length ? values : [0];
  const max = Math.max(...safeValues, 1);
  const min = Math.min(...safeValues, 0);
  const spread = max - min || 1;
  const stepX = labels.length > 1 ? (width - padding * 2) / (labels.length - 1) : 0;

  const points = safeValues.map((value, index) => ({
    x: padding + stepX * index,
    y: height - padding - ((value - min) / spread) * (height - padding * 2),
    value,
    label: labels[index] || '',
  }));

  const path = buildPath(points);

  return (
    <View style={styles.card}>
      <Svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height }}>
        <Line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#C4D4D1" strokeWidth="1.5" />
        <Path d={path} stroke={colors.teal600} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((point) => (
          <Circle key={`${point.label}-${point.x}`} cx={point.x} cy={point.y} r="5.5" fill={colors.coral500} />
        ))}
      </Svg>

      <View style={styles.labels}>
        {points.map((point) => (
          <View key={`${point.label}-legend`} style={styles.legendItem}>
            <Text style={styles.legendLabel}>{point.label}</Text>
            <Text style={styles.legendValue}>{formatCurrency(point.value)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(15, 118, 110, 0.08)',
    ...shadow,
  },
  labels: {
    gap: spacing.xs,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  legendLabel: {
    color: colors.slate500,
    fontSize: 13,
  },
  legendValue: {
    color: colors.ink900,
    fontSize: 13,
    fontFamily: fonts.heading,
  },
});
