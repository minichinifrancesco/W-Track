import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CoachBadgesModal from './CoachBadgesModal';
import { getCoachMutedTextStyle } from '../styles/coachUi';

export default function CoachBadgesSection({ summary, colors, styles, formatOptions }) {
    const badges = summary?.badges;
    const [modalVisible, setModalVisible] = useState(false);

    const items = useMemo(() => {
        if(!Array.isArray(badges?.items)) return [];

        return badges.items;
    }, [badges]);

    if(!badges || badges.earned <= 0 || items.length === 0) {
        return null;
    }

    return (
        <View style={styles.workoutCard}>
            <Text style={styles.sectionTitle}>Badge settimanali</Text>

            <Text
                style={[
                    getCoachMutedTextStyle(colors),
                    {
                        marginTop: 6,
                        marginBottom: 12,
                    },
                ]}
            >
                {badges.earned === 1
                    ? 'Hai ottenuto 1 nuovo badge.'
                    : `Hai ottenuto ${badges.earned} nuovi badge.`}
            </Text>

            <Pressable
                onPress={() => setModalVisible(true)}
                style={{
                    borderWidth: 1,
                    borderColor: colors.accentGreenBorder,
                    backgroundColor: colors.accentGreenBg,
                    borderRadius: 8,
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                }}
            >
                <Ionicons
                    name="ribbon-outline"
                    size={18}
                    color={colors.primary}
                />

                <Text
                    style={{
                        color: colors.primary,
                        fontSize: 13,
                        fontWeight: '800',
                    }}
                >
                    Visualizza badge
                </Text>
            </Pressable>

            <CoachBadgesModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                badges={badges}
                colors={colors}
                formatOptions={formatOptions}
            />
        </View>
    );
}
