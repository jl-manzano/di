// index.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { container } from '../core/container';
import { TYPES } from '../core/types';
import { PokemonViewModel } from '../vm/PokemonVM';
import { Pokemon } from '../domain/entities/Pokemon';

// Obtenemos el ViewModel del contenedor de Inversify
const viewModel = container.get<PokemonViewModel>(TYPES.PokemonViewModel);

const PokemonApp: React.FC = observer(() => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Cargamos los primeros 20 Pokémon al montar el componente
    if (!mounted) {
      viewModel.loadMorePokemons();
      setMounted(true);
    }
  }, [mounted]);

  const renderPokemonItem = ({ item }: { item: Pokemon }) => {
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png`;

    return (
      <TouchableOpacity
        style={styles.pokemonCard}
        onPress={() => {
          viewModel.pokemonSeleccionada = item;
          console.log('Pokémon seleccionado:', item.name);
        }}
        activeOpacity={0.7}
      >
        <Image source={{ uri: imageUrl }} style={styles.pokemonImage} />
        <View style={styles.pokemonInfo}>
          <Text style={styles.pokemonId}>#{item.id.padStart(3, '0')}</Text>
          <Text style={styles.pokemonName}>
            {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
          </Text>
        </View>
        {viewModel.pokemonSeleccionada?.id === item.id && (
          <View style={styles.selectedBadge}>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyComponent = () => {
    if (viewModel.isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#ef5350" />
          <Text style={styles.loadingText}>Cargando Pokémon...</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pokédex</Text>
        <Text style={styles.headerSubtitle}>
          {viewModel.listadoPokemons.length} Pokémon cargados
        </Text>
      </View>

      <FlatList
        data={viewModel.listadoPokemons}
        renderItem={renderPokemonItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyComponent}
      />

      {/* Botón flotante para cargar más */}
      <TouchableOpacity
        style={[
          styles.floatingButton,
          viewModel.isLoading && styles.floatingButtonDisabled
        ]}
        onPress={() => {
          if (!viewModel.isLoading) {
            viewModel.loadMorePokemons();
          }
        }}
        activeOpacity={0.8}
        disabled={viewModel.isLoading}
      >
        {viewModel.isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.floatingButtonText}>+</Text>
        )}
      </TouchableOpacity>

      {viewModel.pokemonSeleccionada && (
        <View style={styles.selectionBar}>
          <Text style={styles.selectionText}>
            Seleccionado: {viewModel.pokemonSeleccionada.name.toUpperCase()}
          </Text>
          <TouchableOpacity
            onPress={() => (viewModel.pokemonSeleccionada = null)}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ef5350',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  listContent: {
    padding: 10,
    paddingBottom: 100,
  },
  pokemonCard: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 5,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    position: 'relative',
  },
  pokemonImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  pokemonInfo: {
    alignItems: 'center',
  },
  pokemonId: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
    fontWeight: '600',
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ef5350',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ef5350',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  floatingButtonDisabled: {
    backgroundColor: '#999',
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '300',
    lineHeight: 36,
  },
  selectionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ef5350',
    padding: 15,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  clearButton: {
    backgroundColor: '#fff',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#ef5350',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PokemonApp;