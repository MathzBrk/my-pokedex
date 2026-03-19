import { StyleSheet } from 'react-native';
import type { Theme } from '../../global/themes';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
    },
    scrollContent: {
      paddingHorizontal: 8,
      alignItems: 'center',
    },
    image: {
      marginHorizontal: 8,
    },
    container: {
      alignItems: 'center',
      marginTop: 8,
    },
    imageRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    arrow: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    arrowDisabled: {
      opacity: 0.3,
    },
    arrowText: {
      fontSize: 28,
      color: theme.colors.text,
    },
    pagerRow: {
      flexDirection: 'row',
      marginTop: 8,
      gap: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 8,
      backgroundColor: theme.colors.muted,
      marginHorizontal: 4,
    },
    dotActive: {
      backgroundColor: theme.colors.primary,
    },
    placeholderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
    },
    placeholderBox: {
      backgroundColor: theme.colors.muted,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
    },
    placeholderText: {
      color: theme.colors.text,
    },
  });
