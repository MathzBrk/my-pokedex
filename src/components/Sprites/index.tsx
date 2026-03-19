import React, { useEffect, useState } from "react";
import { View, Image, ScrollView, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../global/themes";
import { createStyles } from "./styles";

type Props = {
  images: Array<string | null | undefined>;
  size?: number;
  horizontal?: boolean;
  style?: object;
  carousel?: boolean;
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
};

export default function Sprites({
  images,
  size = 140,
  horizontal = false,
  style,
  carousel = false,
  initialIndex = 0,
  onIndexChange,
}: Props) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const validImages = images.filter(Boolean) as string[];

  const [index, setIndex] = useState(
    Math.min(Math.max(0, initialIndex), Math.max(0, validImages.length - 1)),
  );

  useEffect(() => {
    // reset index if images change
    const next = Math.min(
      Math.max(0, initialIndex),
      Math.max(0, validImages.length - 1),
    );
    setIndex(next);
  }, [images, initialIndex]);

  useEffect(() => {
    onIndexChange?.(index);
  }, [index, onIndexChange]);

  if (validImages.length === 0) {
    return (
      <View style={[styles.placeholderContainer, style]}>
        <View style={[styles.placeholderBox, { width: size, height: size }]}>
          <Text style={styles.placeholderText}>No image</Text>
        </View>
      </View>
    );
  }
  // Carousel mode: show one image with arrows and pager
  if (carousel) {
    const prev = () => setIndex((i) => Math.max(0, i - 1));
    const next = () => setIndex((i) => Math.min(validImages.length - 1, i + 1));

    return (
      <View style={[styles.container, style]}>
        <View style={styles.imageRow}>
          <TouchableOpacity
            onPress={prev}
            disabled={index <= 0}
            accessibilityLabel="Previous image"
            style={[styles.arrow, index <= 0 && styles.arrowDisabled]}
          >
            <Text style={styles.arrowText}>‹</Text>
          </TouchableOpacity>

          <Image
            source={{ uri: validImages[index] }}
            style={[styles.image, { width: size, height: size }]}
            resizeMode="contain"
          />

          <TouchableOpacity
            onPress={next}
            disabled={index >= validImages.length - 1}
            accessibilityLabel="Next image"
            style={[
              styles.arrow,
              index >= validImages.length - 1 && styles.arrowDisabled,
            ]}
          >
            <Text style={styles.arrowText}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pagerRow}>
          {validImages.map((_, i) => (
            <View
              key={String(i)}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>
      </View>
    );
  }

  const content = (
    <View style={[styles.row, style]}>
      {validImages.map((uri) => (
        <Image
          key={uri}
          source={{ uri }}
          style={[styles.image, { width: size, height: size }]}
          resizeMode="contain"
        />
      ))}
    </View>
  );

  if (horizontal) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {content}
      </ScrollView>
    );
  }

  return content;
}
