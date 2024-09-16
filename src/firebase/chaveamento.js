import { auth, firestore } from './login';

const formatarNome = (valor) => {
    valor = valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    valor = valor.replace(/[^a-zA-Z0-9\s]/g, '');
    valor = valor.trim().replace(/\s+/g, '-');
    valor = valor.toLowerCase();
    return valor;
};

function formatAndCapitalize(str) {
    return str
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

const coletarChaveamentos = async () => {
    const ano = new Date().getFullYear().toString();
    try {
        const chaveamentosRef = await firestore.collection(`chaveamento-${ano}`).get();
        if (!chaveamentosRef.empty) {
            let chaveamentos = await Promise.all(chaveamentosRef.docs.map( async (doc, index) => {
                return {
                    ...doc.data(),
                    game: formatAndCapitalize(doc.id),
                    id: doc.id,
                }
            }));
            return chaveamentos;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export { coletarChaveamentos };