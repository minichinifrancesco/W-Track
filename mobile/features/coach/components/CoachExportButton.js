import React from 'react';
import {
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CoachExportButton({ disabled, exporting, colors, onPress }) {
    const isEnabled = !disabled;

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            disabled={disabled}
            onPress={onPress}
            style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isEnabled
                    ? colors.accentGreenBg
                    : colors.inputBg,
                borderWidth: 1,
                borderColor: isEnabled
                    ? colors.accentGreenBorder
                    : colors.border,
                opacity: isEnabled ? 1 : 0.45,
            }}
        >
            {exporting ? (
                <ActivityIndicator size="small" color={colors.primary} />
            ) : (
                <Ionicons
                    name="download-outline"
                    size={20}
                    color={isEnabled ? colors.primary : colors.textMuted}
                />
            )}
        </TouchableOpacity>
    );
}