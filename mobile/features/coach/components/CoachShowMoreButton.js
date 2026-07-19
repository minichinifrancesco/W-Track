import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export default function CoachShowMoreButton({ colors, expanded, onPress }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={{
                marginTop: 10,
                paddingVertical: 10,
                alignItems: 'center',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.inputBg,
            }}
        >
            <Text
                style={{
                    color: colors.primary,
                    fontSize: 13,
                    fontWeight: '700',
                }}
            >
                {expanded ? 'Mostra meno' : 'Mostra di più'}
            </Text>
        </TouchableOpacity>
    );
}