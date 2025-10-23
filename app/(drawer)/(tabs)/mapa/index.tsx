import { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, ActivityIndicator, Platform } from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE, Region } from "react-native-maps";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import { useNearbyPlaces } from "../../../../hooks/useNearbyPlaces";
import { useThemeColors } from "../../../../hooks/useThemeColors";
import { zonas, type ZonaId } from "../../../../data/zonas";
import { useCatalogStore } from "../../../../store/catalog";

const INITIAL_REGION: Region = {
    latitude: -16.5,
    longitude: -68.14,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
};

const DEFAULT_RADIUS_KM = 10;

export default function MapaTab() {
    const { colors } = useThemeColors();
    const { dishKey } = useLocalSearchParams<{ dishKey?: string }>();

    useEffect(() => {
        console.log("[Mapa] dishKey param =>", dishKey);
    }, [dishKey]);

    const [region, setRegion] = useState<Region>(INITIAL_REGION);
    const [hasTriedLocation, setHasTriedLocation] = useState(false);

    const mapRef = useRef<MapView | null>(null);
    const centeredKeyRef = useRef<string | null>(null);

    function regionsAreClose(a: Region, b: Region) {
        const eps = 0.0007; 
        return (
            Math.abs(a.latitude - b.latitude) < eps &&
            Math.abs(a.longitude - b.longitude) < eps &&
            Math.abs(a.latitudeDelta - b.latitudeDelta) < 0.001 &&
            Math.abs(a.longitudeDelta - b.longitudeDelta) < 0.001
        );
    }

    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status === "granted") {
                    const loc = await Location.getCurrentPositionAsync({});
                    const next: Region = {
                        latitude: loc.coords.latitude,
                        longitude: loc.coords.longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    };
                    setRegion(next);
                }
            } catch (e) {
                console.warn("[Mapa] Location error:", e);
            } finally {
                setHasTriedLocation(true);
            }
        })();
    }, []);

    const centerForQuery = useMemo(
        () => ({ lat: region.latitude, lng: region.longitude }),
        [region.latitude, region.longitude]
    );

    const { data: places = [], loading: loadingPlaces, error: errorPlaces } =
        useNearbyPlaces({
            center: dishKey ? centerForQuery : null,
            radiusKm: DEFAULT_RADIUS_KM,
            dishKey: dishKey || "",
        });

    useEffect(() => {
        console.log("[Mapa] places len:", places.length, "loading:", loadingPlaces, "error:", errorPlaces);
    }, [places.length, loadingPlaces, errorPlaces]);

    useEffect(() => {
        if (!dishKey) return;

        if (centeredKeyRef.current === dishKey) return;

        if (places.length > 0 && mapRef.current) {
            const coords = places.map((p) => ({
                latitude: p.coords.lat,
                longitude: p.coords.lng,
            }));
            mapRef.current.fitToCoordinates(coords, {
                edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
                animated: true,
            });
            centeredKeyRef.current = dishKey;
        }
    }, [places, dishKey]);

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
            <MapView
                ref={mapRef} 
                style={{ flex: 1 }}
                provider={PROVIDER_GOOGLE}
                initialRegion={INITIAL_REGION}
                region={region}
                onRegionChangeComplete={(r) => {
                    setRegion((prev) => (regionsAreClose(prev, r) ? prev : r));
                }}
                showsUserLocation
                followsUserLocation={false}
                mapPadding={{ top: 0, left: 0, right: 0, bottom: Platform.OS === "android" ? 12 : 0 }}
            >

                {dishKey &&
                    places.map((p) => (
                        <Marker
                            key={p.id}
                            coordinate={{ latitude: p.coords.lat, longitude: p.coords.lng }}
                            title={p.name}
                            description={p.address}
                            pinColor="#E53935"
                        >
                            <Callout>
                                <View style={{ maxWidth: 220 }}>
                                    <Text style={{ fontWeight: "700" }}>{p.name}</Text>
                                    {!!p.address && <Text style={{ color: colors.muted }}>{p.address}</Text>}
                                </View>
                            </Callout>
                        </Marker>
                    ))}
            </MapView>

            {dishKey && !loadingPlaces && places.length === 0 && (
                <View style={{ position: "absolute", left: 12, right: 12, bottom: 20 }}>
                    <View
                        style={{
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                            borderWidth: 1,
                            borderRadius: 12,
                            padding: 12,
                        }}
                    >
                        <Text style={{ color: colors.text, fontWeight: "600" }}>
                            No hay lugares cercanos para “{dishKey}”.
                        </Text>
                        <Text style={{ color: colors.muted, marginTop: 4 }}>
                            Prueba ampliando el radio o moviendo el mapa.
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
}