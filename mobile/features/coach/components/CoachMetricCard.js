import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CoachMetricCard({ metric, colors }) {
    return (
        <View
            style={{
                width: '48%',
                minHeight: 92,
                padding: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.inputBg,
            }}
        >
            <Ionicons name={metric.icon} size={20} color={colors.primary} />

            <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 8 }}>
                {metric.label}
            </Text>

            <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
                style={{
                    color: colors.textDark,
                    fontSize: 22,
                    fontWeight: '700',
                    marginTop: 4,
            }}>
                {metric.value}
            </Text>
        </View>
    );
}