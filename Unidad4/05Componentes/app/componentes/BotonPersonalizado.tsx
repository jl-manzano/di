import { Pressable, Text, StyleSheet } from "react-native";

type Props = {
    texto: string;
    onPress?: () => void;
}

export function BotonPersonalizado({ texto, onPress }: Props) {
    return(
        <Pressable style={styles.boton} onPress={onPress}>
            <Text style={styles.texto}>{texto}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    boton: {
        backgroundColor: "#007AFF",
        marginVertical: 5,
        borderRadius: 8,
        width: 200,
        height: 100,
        alignItems: "center",
        justifyContent : "center"
    },
    texto:{
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        padding: 20
    }
})
