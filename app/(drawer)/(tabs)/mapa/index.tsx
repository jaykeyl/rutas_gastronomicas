import { useMemo } from "react";
import { View, Text } from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useRouter } from "expo-router";
import { useCatalogStore } from "../../../../store/catalog";
import { useThemeColors } from "../../../../hooks/useThemeColors";
import { zonas, zonasMap, type ZonaId } from "../../../../data/zonas";

const INITIAL_REGION: Region = {
    latitude: -16.5,
    longitude: -68.14,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
};

export default function MapaTab() {
    const { colors } = useThemeColors();
    const router = useRouter();
    const platos = useCatalogStore((s) => s.platos);

    const countsByZona = useMemo(() => {
        const counts = new Map<ZonaId, number>();
        zonas.forEach((z) => counts.set(z.id, 0));
        for (const p of platos) {
            if (counts.has(p.zona as ZonaId)) {
                counts.set(p.zona as ZonaId, (counts.get(p.zona as ZonaId) || 0) + 1);
            }
        }
        return counts;
    }, [platos]);

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <MapView style={{ flex: 1 }} provider={PROVIDER_GOOGLE} initialRegion={INITIAL_REGION}>
                {zonas.map((z) => {
                    const count = countsByZona.get(z.id) ?? 0;
                    return (
                        <Marker
                            key={z.id}
                            coordinate={z.centroid}
                            title={z.nombre}
                            description={`${count} ${count === 1 ? "plato" : "platos"}`}
                        >
                            <Callout
                                onPress={() => {
                                    router.push({
                                        pathname: "/(drawer)/(tabs)/platos",
                                        params: { zona: z.id },
                                    });
                                }}
                            >
                                <View style={{ width: 180 }}>
                                    <Text style={{ fontWeight: "800" }}>{z.nombre}</Text>
                                    <Text style={{ color: colors.muted, marginTop: 2 }}>
                                        {count} {count === 1 ? "plato" : "platos"}
                                    </Text>
                                    <Text style={{ color: colors.primary, marginTop: 6 }}>
                                        Tocar para ver platos
                                    </Text>
                                </View>
                            </Callout>
                        </Marker>
                    );
                })}
            </MapView>
        </View>
    );
}
