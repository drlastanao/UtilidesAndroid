import { ImpostorGame } from "@/components/ImpostorGame";

export const metadata = {
    title: "Juego del Impostor - Utilidades Android",
    description: "Deducción social: busca al impostor entre tus amigos.",
};

export default function ImpostorPage() {
    return (
        <main>
            <ImpostorGame />
        </main>
    );
}
