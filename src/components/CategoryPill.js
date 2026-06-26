import { TouchableOpacity, Text } from 'react-native';
import { theme } from '../constants';

export default function CategoryPill({ category, selected, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
        borderRadius: theme.radius.full,
        backgroundColor: selected
          ? category.color
          : theme.colors.surfaceElevated,
        borderWidth: 1,
        borderColor: selected ? category.color : theme.colors.border,
        marginRight: theme.spacing.xs,
        marginBottom: theme.spacing.xs,
      }}>
      <Text
        style={[
          theme.typography.caption,
          {
            color: selected
              ? theme.colors.background
              : theme.colors.textSecondary,
            fontWeight: '600',
          },
        ]}>
        {category.label}
      </Text>
    </TouchableOpacity>
  );
}
