import React from "react";
import { Text, View } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

function getDeltaColor(value, colors) {
    if(value > 0) return colors.primary;
    if(value < 0) return '#ef4444';

    return colors.textMuted;
}

function getDeltaIcon(value) {
    if(value > 0) return 'trending-up-outline';
    if(value < 0) return 'trending-down-outline';

    return 'remove-outline';
}

export default function CoachComparisonRow({ label, value, rawValue, colors }) {
    const color = getDeltaColor(rawValue, colors);
    const icon = getDeltaIcon(rawValue);

    return (
        <View 
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
            }}
        >
            <Text 
                style={{
                    color: colors.textDark,
                    fontSize: 14,
                    fontWeight: '600',
                }}
            >
                {label}
            </Text>
            <View 
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                }}
            >
                <Ionicons name={icon} size={16} color={color} />

                <Text 
                    style={{
                        color,
                        fontSize: 14,
                        fontWeight: '700',
                    }}
                >
                    {value}
                </Text>
            </View>
        </View>
    );
}