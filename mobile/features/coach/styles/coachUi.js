export function getCoachListRowStyle(colors, isLast = false) {
    return {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 10,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.border,
    };
}

export function getCoachInnerCardStyle(colors, borderColor = colors.border, backgroundColor = colors.inputBg) {
    return {
        borderWidth: 1,
        borderColor,
        backgroundColor,
        borderRadius: 8,
        padding: 12,
        marginTop: 10,
    };
}

export function getCoachIconBubbleStyle(colors, backgroundColor = colors.accentGreenBg, borderColor = colors.accentGreenBorder) {
    return {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor,
        borderWidth: 1,
        borderColor,
    };
}

export function getCoachMutedTextStyle(colors) {
    return {
        color: colors.textMuted,
        fontSize: 13,
        lineHeight: 18,
    };
}