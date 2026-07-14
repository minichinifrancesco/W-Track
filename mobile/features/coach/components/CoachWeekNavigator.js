import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function CoachWeekNavigator({styles, isCurrentWeek, onPreviousWeek, onCurrentWeek, onNextWeek}) {
    return (
        <View style={{ gap: 8, marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity 
                    onPress={onPreviousWeek} 
                    style={[styles.secondaryButton, { flex: 1 }]}
                >
                    <Text style={styles.secondaryButtonText}>Settimana precedente</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={onNextWeek}
                    disabled={isCurrentWeek}
                    style={[
                        styles.secondaryButton,
                        { flex: 1, opacity: isCurrentWeek ? 0.45 : 1 }
                    ]}
                >
                    <Text style={styles.secondaryButtonText}>Settimana successiva</Text>
                </TouchableOpacity>
            </View>

            {!isCurrentWeek ? (
                <TouchableOpacity onPress={onCurrentWeek} style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>Settimana attuale</Text>
                </TouchableOpacity>
            ) : null}
        </View>
    );
}