import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  PanResponder,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
  Dimensions,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function DraggableExerciseList({
  items,
  renderItem,
  onReorder,
  contentContainerStyle,
  style,
  ListFooterComponent,
}) {
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [draggingId, setDraggingId] = useState(null);

  const itemLayouts = useRef({});
  const scrollViewRef = useRef(null);
  const scrollOffset = useRef(0);

  const dragStartId = useRef(null);
  const dragItemOriginalY = useRef(0);
  const dragItemHeight = useRef(80);
  const dragStartPageY = useRef(0);
  const dragStartScrollOffset = useRef(0);

  const itemsRef = useRef(items);
  const onReorderRef = useRef(onReorder);
  
  // Sync itemsRef with items only when not dragging to prevent order snaps
  useEffect(() => {
    if (draggingId === null) {
      itemsRef.current = items;
    }
  }, [items, draggingId]);

  useEffect(() => {
    onReorderRef.current = onReorder;
  }, [onReorder]);

  const lastTargetIndex = useRef(-1);
  const currentPageY = useRef(0);
  const autoScrollTimer = useRef(null);

  // Measured on-screen bounds of the ScrollView, set at drag start
  const scrollViewTop = useRef(0);
  const scrollViewBottom = useRef(SCREEN_HEIGHT);

  const startAutoScroll = () => {
    if (autoScrollTimer.current) return;
    autoScrollTimer.current = setInterval(() => {
      if (dragStartId.current === null) {
        stopAutoScroll();
        return;
      }

      const pageY = currentPageY.current;
      const top = scrollViewTop.current;
      const bottom = scrollViewBottom.current;
      // Zone (in px from each edge) where auto-scroll activates
      const scrollZone = 80;

      let speed = 0;
      if (pageY < top + scrollZone) {
        // Closer to the top edge → faster upward scroll
        const ratio = Math.max(0, Math.min(1, 1 - (pageY - top) / scrollZone));
        speed = -(4 + ratio * 16);
      } else if (pageY > bottom - scrollZone) {
        // Closer to the bottom edge → faster downward scroll
        const ratio = Math.max(0, Math.min(1, 1 - (bottom - pageY) / scrollZone));
        speed = 4 + ratio * 16;
      }

      if (speed !== 0) {
        const nextScrollOffset = Math.max(0, scrollOffset.current + speed);
        scrollViewRef.current?.scrollTo({ y: nextScrollOffset, animated: false });
        scrollOffset.current = nextScrollOffset;
      }
    }, 16);
  };

  const stopAutoScroll = () => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
      autoScrollTimer.current = null;
    }
  };

  const computeTargetIndex = (pageY) => {
    const activeId = dragStartId.current;
    if (!activeId) return -1;

    const currentItems = itemsRef.current;
    const fromIndex = currentItems.findIndex((x) => x.id === activeId);
    if (fromIndex === -1) return -1;

    const fingerDelta = pageY - dragStartPageY.current;
    const scrollDelta = scrollOffset.current - dragStartScrollOffset.current;

    const draggedCenterY =
      dragItemOriginalY.current + dragItemHeight.current / 2 + fingerDelta + scrollDelta;

    const others = currentItems.filter((x) => x.id !== activeId);

    if (others.length === 0) return fromIndex;

    let bestIndex = 0;
    let bestDist = Infinity;

    others.forEach((item, idx) => {
      const layout = itemLayouts.current[item.id];
      if (!layout) return;

      const slotMidY = layout.y + layout.height / 2;
      const dist = Math.abs(draggedCenterY - slotMidY);

      if (dist < bestDist) {
        bestDist = dist;
        bestIndex = draggedCenterY < slotMidY ? idx : idx + 1;
      }
    });

    bestIndex = Math.max(0, Math.min(others.length, bestIndex));
    return bestIndex;
  };

  const [localItems, setLocalItems] = useState(items);
  // Keep localItems synced with items when not dragging
  useEffect(() => {
    if (draggingId === null) {
      setLocalItems(items);
    }
  }, [items, draggingId]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: () => dragStartId.current !== null,
      onMoveShouldSetPanResponderCapture: () => dragStartId.current !== null,

      onPanResponderGrant: () => {},

      onPanResponderMove: (evt) => {
        const activeId = dragStartId.current;
        if (!activeId) return;

        const pageY = evt.nativeEvent.pageY;
        currentPageY.current = pageY;
        const targetIndex = computeTargetIndex(pageY);
        if (targetIndex === -1) return;

        const currentItems = itemsRef.current;
        const fromIndex = currentItems.findIndex((x) => x.id === activeId);
        if (fromIndex === -1) return;

        if (targetIndex === fromIndex || targetIndex === lastTargetIndex.current) return;

        const newItems = [...currentItems];
        const [movedItem] = newItems.splice(fromIndex, 1);
        newItems.splice(targetIndex, 0, movedItem);

        lastTargetIndex.current = targetIndex;
        itemsRef.current = newItems;

        LayoutAnimation.configureNext({
          duration: 200,
          create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
          update: { type: LayoutAnimation.Types.easeInEaseOut },
          delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
        });

        setLocalItems(newItems);
      },

      onPanResponderRelease: () => {
        stopAutoScroll();
        if (dragStartId.current !== null) {
          onReorderRef.current(itemsRef.current);
        }
        dragStartId.current = null;
        lastTargetIndex.current = -1;
        setDraggingId(null);
        setScrollEnabled(true);
      },

      // CRITICAL: prevent iOS/Android from stealing the gesture when the
      // finger reaches the screen edge (e.g. system back-swipe). Without
      // this the gesture is terminated and the item snaps back.
      onPanResponderTerminationRequest: () => false,

      onPanResponderTerminate: () => {
        stopAutoScroll();
        // Commit whatever order we reached so items don't snap back
        if (dragStartId.current !== null) {
          onReorderRef.current(itemsRef.current);
        }
        dragStartId.current = null;
        lastTargetIndex.current = -1;
        setDraggingId(null);
        setScrollEnabled(true);
      },
    })
  ).current;

  const handleLongPress = (id, event) => {
    const layout = itemLayouts.current[id];
    if (!layout) return;

    dragStartId.current = id;
    dragItemOriginalY.current = layout.y;
    dragItemHeight.current = layout.height;
    const pageY = event?.nativeEvent?.pageY ?? 0;
    dragStartPageY.current = pageY;
    currentPageY.current = pageY;
    dragStartScrollOffset.current = scrollOffset.current;
    lastTargetIndex.current = -1;

    // Measure the ScrollView's actual on-screen position so auto-scroll
    // boundaries are accurate regardless of where the list sits on screen.
    if (scrollViewRef.current) {
      scrollViewRef.current.measure((x, y, width, height, pageX, svPageY) => {
        scrollViewTop.current = svPageY;
        scrollViewBottom.current = svPageY + height;
      });
    }

    setDraggingId(id);
    setScrollEnabled(false);
    startAutoScroll();
  };


  const flatContentStyle = StyleSheet.flatten(contentContainerStyle) || {};
  const { flex, ...cleanContentStyle } = flatContentStyle;

  return (
    <ScrollView
      ref={scrollViewRef}
      style={[{ flex: 1 }, style]}
      scrollEnabled={scrollEnabled}
      onScroll={(e) => {
        scrollOffset.current = e.nativeEvent.contentOffset.y;
      }}
      scrollEventThrottle={8}
      contentContainerStyle={[cleanContentStyle, { paddingBottom: 100 }]}
      keyboardShouldPersistTaps="handled"
    >
      <View {...panResponder.panHandlers}>
        {localItems.map((item) => {
          const isDragging = draggingId === item.id;
          return (
            <View
              key={item.id}
              onLayout={(e) => {
                if (item.id !== dragStartId.current) {
                  itemLayouts.current[item.id] = {
                    y: e.nativeEvent.layout.y,
                    height: e.nativeEvent.layout.height,
                  };
                }
              }}
              style={isDragging ? draggingStyle : undefined}
            >
              {renderItem(item, (event) => handleLongPress(item.id, event), draggingId !== null)}
            </View>
          );
        })}
      </View>

      {/* Footer (e.g. Add Exercise button) */}
      {ListFooterComponent ? (
        typeof ListFooterComponent === 'function' ? (
          <ListFooterComponent />
        ) : (
          ListFooterComponent
        )
      ) : null}
    </ScrollView>
  );
}

const draggingStyle = {
  opacity: 0.7,
  backgroundColor: '#f0fdf4',
  transform: [{ scale: 1.02 }],
  borderWidth: 1.5,
  borderColor: '#86B749',
  borderRadius: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 6,
};
