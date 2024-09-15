import { auth, firestore } from './login';

const formatarNome = (valor) => {
    valor = valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    valor = valor.replace(/[^a-zA-Z0-9\s]/g, '');
    valor = valor.trim().replace(/\s+/g, '-');
    valor = valor.toLowerCase();
    return valor;
};

const fazerInscricao = (game, nome, turma, telefone, ra) => {
    const ano = new Date().getFullYear().toString();
    try {
        const inscricaoDoc = firestore.collection(ano)
        .doc('interclasse').collection(formatarNome(game)).doc(nome).set({
            nome,
            telefone,
            ra,
            turma,
        });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}


export { fazerInscricao };