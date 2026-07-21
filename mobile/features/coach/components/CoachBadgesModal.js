import React from 'react';
import {
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CoachBadgeRow from './CoachBadgeRow';

export default function CoachBadgesModal({ visible, onClose, badges, colors, formatOptions }) {
    const items = Array.isArray(badges?.items) ? badges.items : [];
    const badgeCount = Number(badges?.earned || 0);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.55)',
                    justifyContent: 'flex-end',
                }}
            >
                <SafeAreaView
                    style={{
                        maxHeight: '88%',
                        backgroundColor: colors.background,
                        borderTopLeftRadius: 18,
                        borderTopRightRadius: 18,
                        overflow: 'hidden',
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingHorizontal: 18,
                            paddingTop: 16,
                            paddingBottom: 10,
                            borderBottomWidth: 1,
                            borderBottomColor: colors.border,
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    color: colors.textDark,
                                    fontSize: 18,
                                    fontWeight: '800',
                                }}
                            >
                                Badge settimanali
                            </Text>

                            <Text
                                style={{
                                    color: colors.textMuted,
                                    fontSize: 13,
                                    marginTop: 4,
                                }}
                            >
                                {badgeCount === 1
                                    ? '1 record ottenuto nel periodo'
                                    : `${badgeCount} record ottenuti nel periodo`}
                            </Text>
                        </View>

                        <Pressable
                            onPress={onClose}
                            hitSlop={10}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: colors.inputBg,
                                borderWidth: 1,
                                borderColor: colors.border,
                            }}
                        >
                            <Ionicons
                                name="close-outline"
                                size={22}
                                color={colors.textDark}
                            />
                        </Pressable>
                    </View>

                    <ScrollView
                        contentContainerStyle={{
                            paddingHorizontal: 14,
                            paddingTop: 14,
                            paddingBottom: 24,
                        }}
                    >
                        {items.map((badge, index) => (
                            <CoachBadgeRow
                                key={badge.id}
                                badge={badge}
                                colors={colors}
                                formatOptions={formatOptions}
                                isLast={index === items.length - 1}
                                showDate
                            />
                        ))}
                    </ScrollView>
                </SafeAreaView>
            </View>
        </Modal>
    );
}