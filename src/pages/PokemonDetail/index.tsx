import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { createStyles } from "./styles";
import { useTheme } from "../../global/themes";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../routes";
import {
  fetchPokemonDetail as fetchPokemonDetailAPI,
  type PokemonDetailResponse,
  fetchPokemonSpecies,
  type PokemonSpeciesResponse,
} from "../../services/pokeapi";

const MOCK_POKEMONS: PokemonDetailState[] = [
  {
    id: 4,
    name: "charmander",
    imageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    types: ["fire"],
    height: 6,
    weight: 85,
    stats: [
      { name: "hp", value: 39 },
      { name: "attack", value: 52 },
      { name: "defense", value: 43 },
      { name: "speed", value: 65 },
    ],
    description:
      "O Charmander tem uma chama acesa na ponta da cauda desde o nascimento. Se a chama apagar, o Charmander morrerá.",
  },
  {
    id: 1,
    name: "bulbasaur",
    imageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    types: ["grass", "poison"],
    height: 7,
    weight: 69,
    stats: [
      { name: "hp", value: 45 },
      { name: "attack", value: 49 },
      { name: "defense", value: 49 },
      { name: "speed", value: 45 },
    ],
    description:
      "A seed was planted on its back at birth. As it grows, the seed also grows larger.",
  },
  {
    id: 7,
    name: "squirtle",
    imageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
    types: ["water"],
    height: 5,
    weight: 90,
    stats: [
      { name: "hp", value: 44 },
      { name: "attack", value: 48 },
      { name: "defense", value: 65 },
      { name: "speed", value: 43 },
    ],
    description:
      "When it retracts its long neck into its shell, it squirts out water with vigorous force.",
  },
];

type PokemonDetailState = {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
  height: number;
  weight: number;
  stats: { name: string; value: number }[];
  description: string;
};

export default function PokemonDetailScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const route = useRoute<RouteProp<RootStackParamList, "PokemonDetail">>();
  const { id } = route.params;

  const [pokemon, setPokemonDetail] = useState<PokemonDetailResponse | null>(
    null,
  );
  const [description, setDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function getPokemonDescriptionFromSpecies(
    species: PokemonSpeciesResponse,
  ): string | null {
    const ptEntry = species.flavor_text_entries.find(
      (entry) => entry.language.name === "pt-BR",
    );
    if (ptEntry) {
      return ptEntry.flavor_text
        .replace(/\s+/g, " ")
        .replace(/\f/g, " ")
        .trim();
    }
    const enEntry = species.flavor_text_entries.find(
      (entry) => entry.language.name === "en",
    );
    if (enEntry) {
      return enEntry.flavor_text
        .replace(/\s+/g, " ")
        .replace(/\f/g, " ")
        .trim();
    }
    return null;
  }

  useEffect(() => {
    const controller = new AbortController();

    const loadPokemon = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [detailData, speciesData] = await Promise.all([
          fetchPokemonDetailAPI(id, { signal: controller.signal }),
          fetchPokemonSpecies(id, { signal: controller.signal }),
        ]);

        const description = getPokemonDescriptionFromSpecies(speciesData);

        setPokemonDetail(detailData);
        setDescription(description);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadPokemon();

    return () => {
      controller.abort();
    };
  }, [id]);

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16, color: theme.colors.text }}>
          Carregando detalhes (simulado)...
        </Text>
      </View>
    );
  }

  if (error || !pokemon) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: theme.colors.text, marginBottom: 16 }}>
          {error ?? "Erro inesperado na simulação."}
        </Text>
        <TouchableOpacity
          style={{
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 24,
            backgroundColor: theme.colors.accent,
          }}
        >
          <Text style={{ color: theme.colors.text, fontWeight: "bold" }}>
            Voltar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionText}>ID informado: {id}</Text>
      <View style={styles.header}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{pokemon.name}</Text>
          <Text style={styles.id}>#{String(pokemon.id).padStart(3, "0")}</Text>
        </View>

        <View style={styles.typeContainer}>
          {pokemon.types.map(({ type }) => (
            <View key={type.name} style={styles.typeBadge}>
              <Text style={styles.typeText}>{type.name}</Text>
            </View>
          ))}
        </View>

        {pokemon.sprites.front_default ? (
          <Image
            source={{
              uri: pokemon.sprites.front_default,
            }}
            style={styles.image}
          />
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre</Text>
        <Text style={styles.sectionText}>
          {description ?? "Descrição não disponível."}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações básicas</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Altura</Text>
          <Text style={styles.infoValue}>{pokemon.height / 10} m</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Peso</Text>
          <Text style={styles.infoValue}>{pokemon.weight / 10} kg</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stats base</Text>
        {pokemon.stats.map((stat) => (
          <View key={stat.stat.name} style={styles.statRow}>
            <Text style={styles.statName}>{stat.stat.name.toUpperCase()}</Text>
            <Text style={styles.statValue}>{stat.base_stat}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
