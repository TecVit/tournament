import { auth, firestore } from './login';

const formatarNome = (valor) => {
    valor = valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    valor = valor.replace(/[^a-zA-Z0-9\s]/g, '');
    valor = valor.trim().replace(/\s+/g, '-');
    valor = valor.toLowerCase();
    return valor;
};

const coletarRegras = async (game) => {
    try {
        const regrasDoc = await firestore.collection('regras')
        .doc(game).get();
        if (regrasDoc.exists) {
            const data = regrasDoc.data();
            let htmlString = data.html;
            return htmlString;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}


export { coletarRegras };