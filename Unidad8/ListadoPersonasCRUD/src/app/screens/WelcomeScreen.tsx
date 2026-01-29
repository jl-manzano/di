import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  const handleNavigateToPersonas = () => {
    router.replace('/(drawer)/personas');
  };

  const handleNavigateToDepartamentos = () => {
    router.replace('/(drawer)/departamentos');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View style={styles.headerBackground} />
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>HR</Text>
            </View>
          </View>
          <Text style={styles.title}>Sistema de Gestión</Text>
          <Text style={styles.subtitle}>Recursos Humanos</Text>
          <View style={styles.headerDivider} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>¡Bienvenido!</Text>
          <Text style={styles.welcomeSubtitle}>Gestiona tu empresa de forma eficiente</Text>
        </View>

        <View style={styles.cardsContainer}>
          <TouchableOpacity 
            style={[styles.card, styles.cardPrimary]}
            onPress={handleNavigateToPersonas}
            activeOpacity={0.9}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconContainer, { backgroundColor: '#667eea' }]}>
                <Text style={styles.cardIcon}>👥</Text>
              </View>
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>Principal</Text>
              </View>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>Gestión de Personal</Text>
              <Text style={styles.cardDescription}>
                Administra empleados, perfiles, datos personales y profesionales
              </Text>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.cardAction}>Acceder</Text>
              <Text style={styles.cardArrow}>→</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, styles.cardSecondary]}
            onPress={handleNavigateToDepartamentos}
            activeOpacity={0.9}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconContainer, { backgroundColor: '#764ba2' }]}>
                <Text style={styles.cardIcon}>🏢</Text>
              </View>
              <View style={[styles.cardBadge, { backgroundColor: '#f0e5ff' }]}>
                <Text style={[styles.cardBadgeText, { color: '#764ba2' }]}>Organización</Text>
              </View>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>Departamentos</Text>
              <Text style={styles.cardDescription}>
                Estructura organizacional, áreas y equipos de trabajo
              </Text>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.cardAction}>Acceder</Text>
              <Text style={styles.cardArrow}>→</Text>
            </View>
          </TouchableOpacity>

          <View style={[styles.card, styles.cardDisabled]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconContainer, { backgroundColor: '#e0e0e0' }]}>
                <Text style={styles.cardIcon}>📊</Text>
              </View>
              <View style={[styles.cardBadge, { backgroundColor: '#fff3cd' }]}>
                <Text style={[styles.cardBadgeText, { color: '#856404' }]}>Próximamente</Text>
              </View>
            </View>
            <View style={styles.cardBody}>
              <Text style={[styles.cardTitle, { color: '#adb5bd' }]}>Reportes y Análisis</Text>
              <Text style={[styles.cardDescription, { color: '#ced4da' }]}>
                Estadísticas, gráficos y métricas del personal
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Características</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>⚡</Text>
              <Text style={styles.featureText}>Rápido y eficiente</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🔒</Text>
              <Text style={styles.featureText}>Datos seguros</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📱</Text>
              <Text style={styles.featureText}>Multi-plataforma</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>☁️</Text>
              <Text style={styles.featureText}>En la nube</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerDivider} />
        <Text style={styles.versionText}>Versión 1.0.0</Text>
        <Text style={styles.copyrightText}>© 2026 Sistema de Gestión HR</Text>
        <Text style={styles.rightsText}>Todos los derechos reservados</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    position: 'relative',
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 24,
    backgroundColor: '#667eea',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  headerBackground: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    position: 'relative',
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#667eea',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    fontWeight: '500',
  },
  headerDivider: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    width: 80,
    alignSelf: 'center',
    marginTop: 24,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  welcomeSection: {
    marginBottom: 28,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
  cardsContainer: {
    gap: 20,
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardPrimary: {
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  cardSecondary: {
    borderLeftWidth: 4,
    borderLeftColor: '#764ba2',
  },
  cardDisabled: {
    opacity: 0.6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 28,
  },
  cardBadge: {
    backgroundColor: '#e7e5ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  cardBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#667eea',
    textTransform: 'uppercase',
  },
  cardBody: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cardAction: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
  },
  cardArrow: {
    fontSize: 20,
    color: '#667eea',
    fontWeight: 'bold',
  },
  featuresSection: {
    marginBottom: 32,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureItem: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  featureIcon: {
    fontSize: 18,
  },
  featureText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#495057',
  },
  footer: {
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  footerDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    width: '100%',
    marginBottom: 16,
  },
  versionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: '#adb5bd',
    marginBottom: 2,
  },
  rightsText: {
    fontSize: 11,
    color: '#ced4da',
  },
});