import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header con gradiente */}
      <View style={styles.headerWrapper}>
        <View style={styles.gradientHeader}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <View style={styles.logoOuter}>
                <View style={styles.logoInner}>
                  <Text style={styles.logoText}>RRHH</Text>
                </View>
              </View>
            </View>
            <Text style={styles.title}>Gestión de Recursos Humanos</Text>
            <Text style={styles.subtitle}>Administra tu talento de forma eficiente</Text>
          </View>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <TouchableOpacity 
          style={styles.statCard}
          onPress={() => router.push('/screens/personas/ListadoPersonasScreen')}
          activeOpacity={0.8}
        >
          <Text style={styles.statNumber}>👥</Text>
          <Text style={styles.statLabel}>Personal</Text>
          <View style={styles.statIndicator}>
            <Text style={styles.statIndicatorText}>Ver →</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.statCard}
          onPress={() => router.push('/screens/departamentos/ListadoDepartamentos')}
          activeOpacity={0.8}
        >
          <Text style={styles.statNumber}>🏢</Text>
          <Text style={styles.statLabel}>Departamentos</Text>
          <View style={styles.statIndicator}>
            <Text style={styles.statIndicatorText}>Ver →</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Main Action Cards */}
      <View style={styles.cardsSection}>
        <Text style={styles.sectionTitle}>Módulos Principales</Text>
        
        <TouchableOpacity 
          style={styles.mainCard}
          onPress={() => router.push('/screens/personas/ListadoPersonasScreen')}
          activeOpacity={0.95}
        >
          <View style={styles.cardGlow} />
          <View style={styles.cardHeader}>
            <View style={[styles.mainCardIcon, { backgroundColor: 'rgba(102, 126, 234, 0.2)' }]}>
              <Text style={styles.mainCardEmoji}>👥</Text>
            </View>
            <View style={styles.cardBadge}>
              <Text style={styles.badgeText}>Principal</Text>
            </View>
          </View>
          <Text style={styles.mainCardTitle}>Gestión de Personal</Text>
          <Text style={styles.mainCardDescription}>
            Administra empleados, cargos, contactos y toda la información del personal de tu organización
          </Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardAction}>Administrar →</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.mainCard}
          onPress={() => router.push('/screens/departamentos/ListadoDepartamentos')}
          activeOpacity={0.95}
        >
          <View style={styles.cardGlow} />
          <View style={styles.cardHeader}>
            <View style={[styles.mainCardIcon, { backgroundColor: 'rgba(240, 147, 251, 0.2)' }]}>
              <Text style={styles.mainCardEmoji}>🏢</Text>
            </View>
            <View style={[styles.cardBadge, { backgroundColor: '#f0f0f0' }]}>
              <Text style={[styles.badgeText, { color: '#6c757d' }]}>Organización</Text>
            </View>
          </View>
          <Text style={styles.mainCardTitle}>Gestión de Departamentos</Text>
          <Text style={styles.mainCardDescription}>
            Organiza y estructura las diferentes áreas y departamentos de tu empresa
          </Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardAction}>Administrar →</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Sistema RRHH v1.0 • 2025</Text>
        <Text style={styles.footerSubtext}>Gestión Integral de Recursos Humanos</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    paddingBottom: 30,
  },
  headerWrapper: {
    marginBottom: -30,
  },
  gradientHeader: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 50,
    backgroundColor: '#667eea',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  logoInner: {
    width: '100%',
    height: '100%',
    borderRadius: 42,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#667eea',
    letterSpacing: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#fff',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 36,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 13,
    color: '#6c757d',
    fontWeight: '600',
    marginBottom: 8,
  },
  statIndicator: {
    marginTop: 4,
  },
  statIndicatorText: {
    fontSize: 11,
    color: '#667eea',
    fontWeight: '700',
  },
  cardsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 16,
    paddingLeft: 4,
  },
  mainCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    position: 'relative',
    overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(102, 126, 234, 0.08)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mainCardIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainCardEmoji: {
    fontSize: 32,
  },
  cardBadge: {
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mainCardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 10,
  },
  mainCardDescription: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 22,
    marginBottom: 20,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  cardAction: {
    fontSize: 15,
    fontWeight: '700',
    color: '#667eea',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#adb5bd',
    fontWeight: '600',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 11,
    color: '#ced4da',
  },
});