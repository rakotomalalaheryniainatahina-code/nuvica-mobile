import React, { useState, useRef, use } from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constant/Colors';
import ThemedSafeAreaView from '@/components/ThemedSafeAreaView';
import { useRouter } from 'expo-router';
import ThemedText from '@/components/ThemedText';
import { Image } from 'react-native';
import styles from '@/styles/onboarding';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  backgroundColor: string;
  illustration: React.ReactNode;
}

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const router = useRouter();
  const slides: OnboardingSlide[] = [
    {
      id: '1',
      title: 'Suivez vos finances facilement',
      description: 'Visualisez toutes vos dépenses et revenus en un coup d’œil, classés par date, catégorie et montant',
      backgroundColor: '#F8F9FF',
      illustration: (
        <View style={styles.illustrationContainer}>
          <View style={styles.mainCircle}>
            <LinearGradient
              colors={['#1E1E2E', '#2E2E3E']}
              style={styles.darkCircle}
            >
              <Image source={require("@/assets/images/logo_white.png")} style={{ width: 70, height: 70, objectFit: "contain", borderRadius: 10 }} />
            </LinearGradient>
          </View>
          <View style={[styles.cryptoIcon, styles.bitcoin]}>
            <ThemedText style={styles.cryptoText}>₿</ThemedText>
          </View>
          <View style={[styles.cryptoIcon, styles.ethereum]}>
            <ThemedText style={styles.cryptoText}>Ξ</ThemedText>
          </View>
          <View style={[styles.smallCircle, styles.purple]}>
            <ThemedText style={styles.percentText}>23%</ThemedText>
          </View>
          <View style={[styles.smallCircle, styles.blue]} />
          <View style={[styles.smallCircle, styles.yellow]} />
        </View>
      ),
    },
    {
      id: '2',
      title: 'Gérez vos transactions au quotidien',
      description: 'Listez vos dépenses et revenus avec date, catégorie et montant, et ajoutez-les en un instant',
      backgroundColor: '#F0F7FF',
      illustration: (
        <View style={styles.illustrationContainer}>
          <View style={styles.securityCard}>
            <LinearGradient
              colors={['#667EEA', '#764BA2']}
              style={styles.gradientCard}
            >
              <View style={styles.lockIcon}>
                <ThemedText style={styles.lockText}>🔒</ThemedText>
              </View>
            </LinearGradient>
          </View>
          <View style={[styles.floatingDot, styles.dot1]} />
          <View style={[styles.floatingDot, styles.dot2]} />
          <View style={[styles.floatingDot, styles.dot3]} />
        </View>
      ),
    },
    {
      id: '3',
      title: 'Comprenez mieux vos habitude',
      description: 'Consultez des graphiques détaillés mensuels et annuels',
      backgroundColor: '#FFF5F0',
      illustration: (
        <View style={styles.illustrationContainer}>
          <View style={styles.chartCard}>
            <LinearGradient
              colors={['#7C3AED', '#EC4899', '#3B82F6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.chartGradient}
            >
              <View style={styles.chartBars}>
                {[40, 60, 45, 70, 55, 80, 65].map((height, index) => (
                  <View
                    key={index}
                    style={[styles.bar, { height: `${height}%` }]}
                  />
                ))}
              </View>
            </LinearGradient>
          </View>
          <View style={styles.trendingBadge}>
            <ThemedText style={styles.trendingText}>📈</ThemedText>
          </View>
        </View>
      ),
    },
    {
      id: '4',
      title: 'Commencez à maîtriser vos finances dès aujourd’hui',
      description: 'Suivi simple, budgets clairs, objectifs atteints',
      backgroundColor: '#F0FFF4',
      illustration: (
        <View style={styles.illustrationContainer}>
          <View style={styles.walletCard}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.walletGradient}
            >
              <View style={styles.walletContent}>
                <View style={styles.chip} />
                <ThemedText style={styles.walletAmount}>9745.00 Ar</ThemedText>
                <View style={styles.walletDetails}>
                  <View style={styles.detailLine} />
                  <View style={[styles.detailLine, styles.shortLine]} />
                </View>
              </View>
            </LinearGradient>
          </View>
          <View style={styles.plusBadge}>
            <ThemedText style={styles.plusText}>+</ThemedText>
          </View>
        </View>
      ),
    },
  ];

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({
        index: currentIndex + 1,
      });
    }
  };

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const renderItem = ({ item }: { item: OnboardingSlide }) => (
    <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
      {item.illustration}
      <View style={styles.textContainer}>
        <ThemedText style={styles.title}>{item.title}</ThemedText>
        <ThemedText style={styles.description}>{item.description}</ThemedText>
      </View>
    </View>
  );

  return (
    <ThemedSafeAreaView style={styles.container}>

      {/* Skip Button */}
      <View style={styles.header}>
        {currentIndex < slides.length - 1 && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => setCurrentIndex(slides.length - 1)}
          >
            <ThemedText style={styles.skipText}>Skip</ThemedText>
          </TouchableOpacity>
        )}
      </View>

      {/* Slides */}
      <FlatList
        data={slides}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />

      {/* Footer */}
      <View style={styles.footer}>
        {/* Pagination */}
        <View style={styles.pagination}>
          {slides.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Button */}
        {currentIndex === slides.length - 1 ? (
          <TouchableOpacity onPress={() => router.push('/auth/commencer')} style={styles.button}>
            <View
              style={styles.buttonGradient}
            >
              <ThemedText style={styles.buttonText}>Commencer</ThemedText>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={scrollTo}>
            <View
              style={styles.buttonGradient}
            >
              <ThemedText style={styles.buttonText}>Suivante</ThemedText>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </ThemedSafeAreaView>
  );
};

export default OnboardingScreen;