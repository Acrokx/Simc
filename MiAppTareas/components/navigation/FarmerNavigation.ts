import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../theme';

export const ADMIN_BOTTOM_NAV = [
  { icon: '🏠', label: 'Inicio', route: '/(admin)/dashboard' },
  { icon: '🌱', label: 'Cultivos', route: '/(admin)/cultivos' },
  { icon: '📡', label: 'Sensores', route: '/(admin)/sensores' },
  { icon: '🚨', label: 'Alertas', route: '/(admin)/alertas' },
  { icon: '👤', label: 'Perfil', route: '/(admin)/perfil' },
] as const;

export const AGRICULTOR_BOTTOM_NAV = [
  { icon: '🏠', label: 'Inicio', route: '/(agricultor)/dashboard' },
  { icon: '🏡', label: 'Fincas', route: '/(agricultor)/mis-fincas' },
  { icon: '🌱', label: 'Cultivos', route: '/(agricultor)/mis-cultivos' },
  { icon: '📡', label: 'Sensores', route: '/(agricultor)/sensores' },
  { icon: '💧', label: 'Riego', route: '/(agricultor)/riego' },
  { icon: '📊', label: 'Estadísticas', route: '/(agricultor)/estadisticas' },
  { icon: '🚨', label: 'Alertas', route: '/(agricultor)/alertas' },
  { icon: '👤', label: 'Perfil', route: '/(agricultor)/perfil' },
] as const;

export const ADMIN_EXTRA_ROUTES = [
  { icon: '🧠', title: 'Configuración IA', route: '/(admin)/configuracion/inteligente' },
  { icon: '📝', title: 'Reportes', route: '/(admin)/reportes' },
  { icon: '🔒', title: 'Seguridad', route: '/(admin)/seguridad' },
  { icon: '☁️', title: 'Config. Sistema', route: '/(admin)/configuracion/sistema' },
];
